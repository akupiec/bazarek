import { CommandModule } from 'yargs';
import { ScreenPrinter } from '../console/ScreenPrinter';
import axios from 'axios';
import { LogStatus } from '../console/Interfaces';
import { DataBase } from '../utils/DataBase';
import { createBazarek } from '../utils/db/createTables';

const { JSDOM } = require('jsdom');

interface BazarGameData {
  id: number;
  href?: string;
  name: string;
  price?: number;
  offers: number;
  updateTime: string;
}

class UpdateBazarData {
  private screenPrinter = new ScreenPrinter();
  private db = new DataBase();

  constructor() {
    this.db.createTable(createBazarek);
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
      this.db.replaceObjs('bazarek', data);
      haveNextPages = UpdateBazarData.doHaveNextPage(pageData);
    } while (haveNextPages);
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
      const date = new Date().toISOString();
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
    const url = `https://bazar.lowcygier.pl/?options=&type=&platform%5B0%5D=1&platform%5B1%5D=5&platform%5B2%5D=7&payment=&payment%5B%5D=1&payment%5B%5D=2&game_type=&game_genre=&title=&game_id=&sort=price&per-page=100&page=${page}`;
    return axios.get(url).then((resp) => new JSDOM(resp.data));
  }
}

export function updateCommand(): CommandModule {
  return {
    command: 'update',
    aliases: ['fetch', 'init'],
    describe: 'fetch & update all require data',
    handler: () => {
      new UpdateBazarData().run();
    },
  };
}
