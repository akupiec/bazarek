import { CommandModule } from 'yargs';
import { ScreenPrinter } from '../console/ScreenPrinter';
const axios = require('../utils/api');
import { LogStatus } from '../console/Interfaces';
import { DataBase } from '../utils/DataBase';
import { clearOldData, createTable, selectSteamToUpdate } from '../utils/db/bazarek_sql';

const { JSDOM } = require('jsdom');

interface BazarGameData {
  id: number;
  href?: string;
  name: string;
  price?: number;
  offers: number;
  updateTime: string;
  steamHref?: string;
}

class UpdateBazarData {
  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {
    this.db.run(createTable);
  }

  async run() {
    let haveNextPages = true;
    let page = 0;
    this.screenPrinter.log('Pulling BazarData');
    this.screenPrinter.spinner(`page: ${page}`);
    do {
      const pageData = await this.getGamesAtPage(page++);
      this.screenPrinter.spinner(`page: ${page}`);
      const data = UpdateBazarData.getGameData(pageData);
      this.db.replaceObjs('bazarek', data, ['steamHref']);
      haveNextPages = UpdateBazarData.doHaveNextPage(pageData);
    } while (haveNextPages);
    this.screenPrinter.log('Clearing old data');
    this.clearOldData();

    this.screenPrinter.log('All done', LogStatus.Success);
    this.screenPrinter.stopSpinner();
  }

  private static doHaveNextPage(dom) {
    return !dom.window.document.querySelector('.mynext.disabled');
  }

  private static getGameData(dom): BazarGameData[] {
    const listNode = dom.window.document.querySelectorAll('div.list-view > div .media-heading');
    const listPrices = dom.window.document.querySelectorAll('div.list-view > div p.prc');
    const listOffers = dom.window.document.querySelectorAll('div.list-view > div p.prc-text');
    const a: BazarGameData[] = [];

    for (let i = 0; i < listNode.length; i++) {
      let href = listNode[i].children[0].href;
      const date = new Date().toISOString().slice(0, -1);
      a.push({
        id: Number(href.match(/\d+/)[0]),
        name: listNode[i].textContent.trim(),
        href: href,
        price: this.parsePrice(listPrices[i]),
        offers: parseInt(listOffers[i].textContent.trim()),
        updateTime: date,
      });
    }
    return a;
  }

  private static parsePrice(elPrice) {
    return parseFloat(elPrice.textContent.trim().replace(',', '.'));
  }

  private getGamesAtPage(page = 0) {
    const pageSize = 100;
    const url = `https://bazar.lowcygier.pl/?options=&type=&platform%5B0%5D=1&platform%5B1%5D=5&platform%5B2%5D=7&payment=&payment%5B%5D=1&payment%5B%5D=2&game_type=&game_genre=&title=&game_id=&sort=price&per-page=${pageSize}&page=${page}`;
    return axios.get(url).then((resp) => new JSDOM(resp.data));
  }

  private clearOldData() {
    this.db.run(clearOldData);
  }
}

class UpdateBazarSteamLinks {
  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {
    this.db.run(createTable);
  }

  async run() {
    const data: BazarGameData[] = await this.db.all(selectSteamToUpdate);
    this.screenPrinter.log('Downloading steam links');
    this.screenPrinter.setProgress(0, data.length);

    let idx = 0;
    const promises = data.map(async (row) => {
      const d = await this.getSteamData(row);
      const res = await this.db.replaceObj('bazarek', d);
      this.screenPrinter.setProgress(idx++, data.length);
      return res;
    });

    await Promise.all(promises);

    this.screenPrinter.setProgress(0, 0);
    this.screenPrinter.log('Linking done!', LogStatus.Success);
  }

  private getSteamData(data) {
    return axios.get(`https://bazar.lowcygier.pl${data.href}`).then((resp) => {
      const a = new JSDOM(resp.data);
      const nodes = a.window.document.querySelectorAll('a[href]') as any[];
      const steamNode = Array.from(nodes)
        .filter((n) => n.href)
        .find((n) => n.href.includes('store.steam'));
      data.steamHref = (steamNode && steamNode.href) || null;
      return data;
    });
  }
}

class UpdateCommand {
  private screenPrinter = new ScreenPrinter();
  private db = new DataBase();

  async run() {
    await new UpdateBazarData(this.screenPrinter, this.db).run();
    await new UpdateBazarSteamLinks(this.screenPrinter, this.db).run();
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
