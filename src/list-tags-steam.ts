import { ScreenPrinter } from './console/ScreenPrinter';
import { STEAM_CATEGORIES, STEAM_TAGS } from './config';

require('./utils/utils');

const fs = require('fs');
const { STEAM_DATA_PATH } = require('./config');

function getExistingSteamData(): Map<number, any> {
  if (fs.existsSync(STEAM_DATA_PATH)) {
    return new Map(JSON.parse(fs.readFileSync(STEAM_DATA_PATH)));
  }
  return new Map();
}

export async function runListTags(args) {
  const screenPrinter = new ScreenPrinter();
  const steamDataMap = getExistingSteamData();

  const END = steamDataMap.size;
  const tags = new Set<string>();
  const categories = new Set<string>();
  screenPrinter.setSuccessMessage(0, `Listing....${END}`);
  screenPrinter.setProgressBar(1, `${0} of ${END}`);
  let progress = 0;

  for (let [key, val] of steamDataMap) {
    if (val.categories && val.tags) {
      val.tags.forEach((t) => tags.add(t));
      val.categories.forEach((c) => categories.add(c));
    }
    screenPrinter.updateProgressBar(1, progress++, END);
    screenPrinter.updateMessage(1, `${progress} of ${END}`);
  }

  fs.writeFileSync(STEAM_TAGS, JSON.stringify(Array.from(tags)));
  fs.writeFileSync(STEAM_CATEGORIES, JSON.stringify(Array.from(categories)));
}
