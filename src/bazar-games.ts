import {ScreenPrinter} from "./console/ScreenPrinter";

const axios = require('axios');
const fs = require('fs');
const { BAZAR_PATH } = require('./config');
const { JSDOM } = require('jsdom');

// document.querySelector('.popular_tags_ctn > div.glance_tags').textContent

function getGameData(dom) {
  const listNode = dom.window.document.querySelectorAll('div.list-view > div .media-heading');
  const listPrices = dom.window.document.querySelectorAll('div.list-view > div p.prc');
  const listOffers = dom.window.document.querySelectorAll('div.list-view > div p.prc-text');
  const a = [];
  for (let i = 0; i < listNode.length; i++) {
    let href = listNode[i].children[0].href;
    a.push({
      id: Number(href.match(/\d+/)[0]),
      text: listNode[i].textContent.trim(),
      href: href,
      price: listPrices[i].textContent.trim(),
      offers: listOffers[i].textContent.trim(),
    });
  }
  return a;
}

function getGamesAtPage(page = 0) {
  return axios
    .get(
      `https://bazar.lowcygier.pl/?options=&type=&platform%5B0%5D=1&platform%5B1%5D=5&platform%5B2%5D=7&payment=&payment%5B%5D=1&payment%5B%5D=2&game_type=&game_genre=&title=&game_id=&sort=price&per-page=100&page=${page}`,
    )
    .then((resp) => {
      return new JSDOM(resp.data);
    });
}

function haveNextPage(dom) {
  return !dom.window.document.querySelector('.mynext.disabled');
}

export async function runBazar(args) {
  const screenPrinter = new ScreenPrinter();

  let haveNextPages = true;
  const games = [];
  let page = 0;
  screenPrinter.setSuccessMessage(0, 'Pulling BazarData');
  screenPrinter.setSpinner(1, `page: ${page}`);
  do {
    const pageData = await getGamesAtPage(page++);
    screenPrinter.updateMessage(1, `page: ${page}`);
    games.push(...getGameData(pageData));
    haveNextPages = haveNextPage(pageData);
  } while (haveNextPages);
  screenPrinter.setSuccessMessage(1, 'All done');
  fs.writeFileSync(BAZAR_PATH, JSON.stringify(games));
}