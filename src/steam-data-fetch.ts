import { ScreenPrinter } from './console/ScreenPrinter';

require('./utils/utils');
const axios = require('./utils/api');

const fs = require('fs');
const { STEAM_DATA_PATH } = require('./config');
const { JSDOM } = require('jsdom');

function getSteamData(href) {
  return axios.get(href).then((resp) => {
    const a = new JSDOM(resp.data);
    const tagsNode = a.window.document.querySelector('.popular_tags_ctn > div.glance_tags');
    const tagsStr = (tagsNode && tagsNode.textContent) || '';
    let tags = tagsStr.trim().slice(0, -1).split('\n');
    tags = tags.map((t) => t.trim()).filter((t) => !!t);
    const reviewNode = a.window.document.querySelector('.game_review_summary ');
    const reviewSummary = reviewNode && reviewNode.textContent.trim();
    const categories = Array.from(
      a.window.document.querySelectorAll('#category_block  .name'),
    ).map((a: any) => a.textContent.trim());
    const element = a.window.document.querySelector('.responsive_hidden');
    const responses = element && element.textContent.trim();
    return {
      tags,
      reviewSummary,
      responses,
      categories,
    };
  });
}

function saveGameData(steamData: Map<number, any>, screenPrinter: ScreenPrinter) {
  fs.writeFileSync(STEAM_DATA_PATH, JSON.stringify(Array.from(steamData)));
  screenPrinter.setSuccessMessage(0, 'done');
  process.exit(1);
}

function getExistingSteamData(): Map<number, any> {
  if (fs.existsSync(STEAM_DATA_PATH)) {
    return new Map(JSON.parse(fs.readFileSync(STEAM_DATA_PATH)));
  }
  return new Map();
}

export async function runSteamFetch(args) {
  const screenPrinter = new ScreenPrinter();
  const steamDataMap = getExistingSteamData();

  const END = steamDataMap.size;
  screenPrinter.setSuccessMessage(0, `Downloading....${END}`);
  screenPrinter.setProgressBar(1, `${0} of ${END}`);
  let promises = [];
  let progress = 0;

  for (let [key, val] of steamDataMap) {
    if (!val.tags) {
      const promise = getSteamData(val.steamHref).then(
        (data) => {
          screenPrinter.updateProgressBar(1, progress++, END);
          screenPrinter.updateMessage(1, `${progress} of ${END}`);
          val.tags = data.tags;
          val.reviewSummary = data.reviewSummary;
          val.responses = data.responses;
          val.categories = data.categories;
          steamDataMap.set(key, val);
        },
        (err) => screenPrinter.setErrorMessage(1, err),
      );
      promises.push(promise);
    } else {
      screenPrinter.updateProgressBar(1, progress++, END);
      screenPrinter.updateMessage(1, `${progress} of ${END}`);
    }
  }

  //catches ctrl+c event
  process.on('SIGINT', () => {
    saveGameData(steamDataMap, screenPrinter);
  });

  return Promise.all(promises).then(
    () => saveGameData(steamDataMap, screenPrinter),
    () => saveGameData(steamDataMap, screenPrinter),
  );
}
