import { ScreenPrinter } from '../console/ScreenPrinter';
import { SteamMap } from '../interfaces/SteamMap';

require('../utils/utils');

const fs = require('fs');
const { STEAM_DATA_PATH } = require('../config');

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

export async function runCleanSteam(args) {
  const screenPrinter = new ScreenPrinter();
  const steamDataMap: Map<number, SteamMap> = getExistingSteamData();

  const END = steamDataMap.size;
  screenPrinter.setSuccessMessage(0, `Cleaning....${END}`);
  screenPrinter.setProgressBar(1, `${0} of ${END}`);
  let promises = [];
  let progress = 0;

  for (let [key, val] of steamDataMap) {
    if(!val.steamId) {
      steamDataMap.delete(key);
    }
    screenPrinter.updateProgressBar(1, progress++, END);
    screenPrinter.updateMessage(1, `${progress} of ${END}`);
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
