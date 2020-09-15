import { myAxios as axios } from '../api';
import { JSDOM } from 'jsdom';
import { BazarekDB, BazarekI } from '../../db/model/BazarekDB';

export class Bazarek {
  private static fetchPage(page = 0) {
    const pageSize = 100;
    const url = `https://bazar.lowcygier.pl/?type=&platform=&platform%5B%5D=1&platform%5B%5D=5&platform%5B%5D=7&payment=&payment%5B%5D=1&game_type=&game_type%5B%5D=game&game_type%5B%5D=dlc&game_type%5B%5D=pack&game_genre=&title=&game_id=&sort=title&per-page=${pageSize}&page=${page}`;
    return axios.get(url).then((resp) => new JSDOM(resp.data));
  }

  private static parseGameData(dom: JSDOM): BazarekI[] {
    const listNode = dom.window.document.querySelectorAll('div.list-view > div .media-heading');
    const listPrices = dom.window.document.querySelectorAll('div.list-view > div p.prc');
    const listOffers = dom.window.document.querySelectorAll('div.list-view > div p.prc-text');
    const a: BazarekI[] = [];

    for (let i = 0; i < listNode.length; i++) {
      let href = (listNode[i].children[0] as any).href;
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

  private static fetchSingleGame(id: string | number) {
    return axios.get(`https://bazar.lowcygier.pl/offer/game/${id}`);
  }

  private static parseSingleGame(a: JSDOM) {
    const steamHref = this.findSteamHref(a);
    const steamId = this.matchFirst(steamHref, /\d+/);
    const offerElement = a.window.document.querySelector('meta[property="og:url"]') as any;
    const offerHref = offerElement.content;
    return {
      steamHref: steamHref,
      steamId: steamId ? parseInt(steamId) : undefined,
      offerId: parseInt(offerHref.match(/\d+/)[0]),
    };
  }

  static getSteamData(data: BazarekDB) {
    return this.fetchSingleGame(data.id).then((resp) => this.parseSingleGame(new JSDOM(resp.data)));
  }

  static getDataAtPage(page: number) {
    return this.fetchPage(page).then((a) => this.parseGameData(a));
  }
}
