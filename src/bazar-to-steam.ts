import { ScreenPrinter } from './console/ScreenPrinter';

require('./utils/utils');
const axios = require('./utils/api');

const fs = require('fs');
const { BAZAR_PATH, STEAM_DATA_PATH } = require('./config');
const { JSDOM } = require('jsdom');

const games = JSON.parse(fs.readFileSync(BAZAR_PATH));
const START = 0;
const END = 0 || games.length;

function getSteamData(data) {
  return axios.get(`https://bazar.lowcygier.pl${data.href}`).then((resp) => {
    const a = new JSDOM(resp.data);
    const nodes = a.window.document.querySelectorAll('a[href]') as any[];
    const steamNode = Array.from(nodes).filter(n => n.href).find(n => n.href.includes('steam'));
    data.steamHref = steamNode && steamNode.href || null;
    const regExpMatchArray = data.steamHref.match(/\d+/);
    data.steamId = parseInt(regExpMatchArray && regExpMatchArray[0]);
    return data;
  });
}

function saveGameData(steamData: Map<number, any>, screenPrinter: ScreenPrinter) {
  fs.writeFileSync(STEAM_DATA_PATH, JSON.stringify(Array.from(steamData)));
  screenPrinter.setSuccessMessage(0, 'done');
}

function getExistingSteamData(): Map<number, any> {
  if (fs.existsSync(STEAM_DATA_PATH)) {
    return new Map(JSON.parse(fs.readFileSync(STEAM_DATA_PATH)));
  }
  return new Map();
}
export async function runBazarToSteam(args) {
  const screenPrinter = new ScreenPrinter();
  screenPrinter.setSuccessMessage(0, `Downloading....${END - START}`);
  const steamDataMap = getExistingSteamData();
  screenPrinter.setProgressBar(1, `${0} of ${END}`);
  let promises = [];

  let progress = 0;

  for (let i = START; i < END; i++) {
    const hasData = steamDataMap.has(games[i].id);
    if (hasData) {
      screenPrinter.updateProgressBar(1, progress++, END);
      screenPrinter.updateMessage(1, `${progress} of ${END}`);
      continue;
    }
    const promise = getSteamData(games[i]).then(
      (data) => {
        if (data.steamHref) {
          steamDataMap.set(data.id, {
            steamHref: data.steamHref,
            steamId: data.steamId,
          });
        }
        screenPrinter.updateProgressBar(1, progress++, END);
        screenPrinter.updateMessage(1, `${progress} of ${END}`);
        return data;
      },
      (err) => screenPrinter.setErrorMessage(1, err),
    );
    promises.push(promise);
  }
  screenPrinter.setSuccessMessage(0, 'saving....');

  //catches ctrl+c event
  process.on('SIGINT', () => {
    saveGameData(steamDataMap, screenPrinter);
    process.exit(1);
  });

  await Promise.all(promises).then(
    () => saveGameData(steamDataMap, screenPrinter),
    () => saveGameData(steamDataMap, screenPrinter),
  );
}
