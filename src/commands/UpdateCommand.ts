import { CommandModule } from 'yargs';
import { ScreenPrinter } from '../console/ScreenPrinter';
import { LogStatus } from '../console/Interfaces';
import { DataBase } from '../db/DataBase';
import { BazarekDB, BazarekI } from '../db/model/BazarekDB';
import { myAxios as axios } from '../utils/api';
import { JSDOM } from 'jsdom';
import { SteamDB, SteamI } from '../db/model/SteamDB';
import { Op } from 'sequelize';
import moment from 'moment';

const START_PAGE = 1;
const LAST_PAGE = 1;

function documentQueryAsText(node: JSDOM, selector: string): string | undefined {
  const queryNode = node.window.document.querySelector(selector);
  if (queryNode) {
    return queryNode.textContent || undefined;
  }
}

class UpdateBazarData {
  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {}

  async run() {
    let progress = 1;
    const maxPages = LAST_PAGE;
    this.screenPrinter.log('Pulling BazarData');
    this.screenPrinter.spinner(`page: ${progress}`);
    const needUpdate = await this.db.count(BazarekDB, {
      where: { updatedAt: { [Op.lt]: moment().subtract(20, 'minutes') } },
    });
    const hasRecords = await this.db.count(BazarekDB, {});
    if (hasRecords && !needUpdate) {
      this.screenPrinter.log('All done', LogStatus.Success);
      this.screenPrinter.stopSpinner();
      return;
    }

    const promises: Promise<any>[] = [];
    for (let page = START_PAGE; page <= maxPages; page++) {
      const prom = this.fetchAndUpdateData(page);
      prom.then(() => {
        this.screenPrinter.spinner(`page: ${progress++}`);
      });
      promises.push(prom);
    }

    return Promise.all(promises).then(
      () => {
        this.screenPrinter.log('All done', LogStatus.Success);
        this.screenPrinter.stopSpinner();
      },
      (err) => {
        console.log(err);
        process.exit(-1);
      },
    );
  }

  private static getGameData(dom: JSDOM): BazarekI[] {
    const listNode = dom.window.document.querySelectorAll('div.list-view > div .media-heading');
    const listPrices = dom.window.document.querySelectorAll('div.list-view > div p.prc');
    const listOffers = dom.window.document.querySelectorAll('div.list-view > div p.prc-text');
    const a: BazarekI[] = [];

    for (let i = 0; i < listNode.length; i++) {
      let href = (listNode[i].children[0] as any).href;
      const date = new Date().toISOString().slice(0, -1);
      a.push({
        id: Number(href.match(/\d+/)[0]),
        name: (listNode[i].textContent as any).trim(),
        price: this.parsePrice(listPrices[i]),
        offers: parseInt((listOffers[i].textContent as any).trim()),
      });
    }
    return a;
  }

  private static parsePrice(elPrice: any) {
    return parseFloat(elPrice.textContent.trim().replace(',', '.'));
  }

  private getGamesAtPage(page = 0) {
    const pageSize = 100;
    const url = `https://bazar.lowcygier.pl/?type=&platform=&platform%5B%5D=1&platform%5B%5D=5&platform%5B%5D=7&payment=&payment%5B%5D=1&game_type=&game_type%5B%5D=game&game_type%5B%5D=dlc&game_type%5B%5D=pack&game_genre=&title=&game_id=&sort=title&per-page=${pageSize}&page=${page}`;
    return axios.get<string>(url).then((resp) => new JSDOM(resp.data));
  }

  private async fetchAndUpdateData(page: number) {
    const pageData = await this.getGamesAtPage(page);
    const data = UpdateBazarData.getGameData(pageData);
    await this.db.insupsRaw(data, BazarekDB);
    return;
  }
}

class UpdateBazarSteamLinks {
  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {}

  async run() {
    const date = moment().subtract('15', 'minutes').toDate();
    const bazarek = await this.db.findAll<BazarekDB>(BazarekDB, {
      where: {
        [Op.or]: {
          offerId: null,
          [Op.and]: {
            steamId: null,
            updatedAt: {
              [Op.lt]: date,
            },
          },
        },
      },
      attributes: ['id', 'updatedAt'],
    });
    this.screenPrinter.log('Downloading steam links');
    this.screenPrinter.setProgress(0, bazarek.length);

    let idx = 0;
    const promises = bazarek.map(async (b) => {
      const dataToSave = await this.getSteamData(b);
      if (!dataToSave.steamId) {
        b.changed('updatedAt', true);
        await b.save();
      }
      if (dataToSave) {
        await this.db.insert({ id: dataToSave.steamId, href: dataToSave.steamHref }, SteamDB);
        b.steamId = dataToSave.steamId;
        b.offerId = dataToSave.offerId;
        await b.save();
      }
      this.screenPrinter.setProgress(idx++, bazarek.length);
      return;
    });
    await Promise.all(promises);

    this.screenPrinter.setProgress(0, 0);
    this.screenPrinter.log('Linking done!', LogStatus.Success);
  }

  private getSteamData(data: BazarekDB) {
    return axios.get(`https://bazar.lowcygier.pl/offer/game/${data.id}`).then((resp) => {
      const a = new JSDOM(resp.data);
      const steamHref = UpdateBazarSteamLinks.findSteamHref(a);
      const steamId = UpdateBazarSteamLinks.matchFirst(steamHref, /\d+/);
      const offerElement = a.window.document.querySelector('meta[property="og:url"]') as any;
      const offerHref = offerElement.content;
      return {
        steamHref: steamHref,
        steamId: steamId ? parseInt(steamId) : undefined,
        offerId: parseInt(offerHref.match(/\d+/)[0]),
      };
    });
  }

  private static findSteamHref(a: JSDOM) {
    const nodes: NodeListOf<HTMLLinkElement> = a.window.document.querySelectorAll('a[href]');
    const steamNode = Array.from(nodes)
      .filter((n) => n.href)
      .find((n) => n.href.includes('store.steam'));
    return steamNode && steamNode.href;
  }

  private static matchFirst(str: string | undefined, regEx: RegExp) {
    if (!str) {
      return null;
    }
    const match = str.match(regEx);
    return match ? match[0] : null;
  }
}

class UpdateSteamBasicData {
  steamDatas: SteamI[] = [];

  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {
    process.on('SIGINT', async () => {
      await SteamDB.updateAll(this.steamDatas);
    });
  }

  async run() {
    const steam = await this.db.findAll<SteamDB>(SteamDB, {
      // where: { name: null },
      limit: 50,
    });
    const total = steam.length;
    this.screenPrinter.log('Downloading basic steam data');
    this.screenPrinter.setProgress(0, total);

    let idx = 0;
    const promises = steam.map(async (s) => {
      this.steamDatas.push(await this.getSteamData(s));
      this.screenPrinter.setProgress(idx++, total);
    });
    await Promise.allSettled(promises).then(async () => {
      await SteamDB.updateAll(this.steamDatas);
      this.steamDatas = [];
    });

    this.screenPrinter.setProgress(0, 0);
    this.screenPrinter.log('Linking done!', LogStatus.Success);
  }

  getSteamData(steam: SteamDB): Promise<SteamI> {
    const href = `https://store.steampowered.com/app/${steam.id}`;
    return axios
      .get(href, {
        retry: 3,
        retryDelay: 3000,
        headers: { Cookie: 'wants_mature_content=1; birthtime=628470001;' },
      } as any)
      .then((resp) => {
        const a = new JSDOM(resp.data);
        const name = documentQueryAsText(a, '.apphub_AppName');
        const tags = UpdateSteamBasicData.findSteamTags(a);
        // const reviewNode = a.window.document.querySelector('.game_review_summary ');
        // const reviewSummary = reviewNode && reviewNode.textContent.trim();
        const categories = UpdateSteamBasicData.findSteamCategory(a);
        return { id: steam.id, href: steam.href, tags, name, categories };
      });
  }

  private static findSteamTags(a: JSDOM) {
    const tagsNode = a.window.document.querySelector('.popular_tags_ctn > div.glance_tags');
    const tagsStr = (tagsNode && tagsNode.textContent) || '';
    let tags = tagsStr.trim().slice(0, -1).split('\n');
    tags = tags.map((t) => t.trim()).filter((t) => !!t);
    return tags;
  }

  private static findSteamCategory(a: JSDOM) {
    return Array.from(a.window.document.querySelectorAll('#category_block  .name')).map((a: any) =>
      a.textContent.trim(),
    );
  }
}

class UpdateCommand {
  private screenPrinter = new ScreenPrinter();
  private db = new DataBase();

  async run() {
    await this.db.isReady;
    await new UpdateBazarData(this.screenPrinter, this.db).run();
    await new UpdateBazarSteamLinks(this.screenPrinter, this.db).run();
    await new UpdateSteamBasicData(this.screenPrinter, this.db).run();
  }
}

export function updateCommand(): CommandModule {
  return {
    command: 'update',
    aliases: ['fetch', 'init'],
    describe: 'fetch & update all require data',
    handler: () => {
      new UpdateCommand().run();
    },
  };
}
