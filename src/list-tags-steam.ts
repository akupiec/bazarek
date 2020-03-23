import { ScreenPrinter } from './console/ScreenPrinter';
import { STEAM_CATEGORIES, STEAM_REVIEWS, STEAM_TAGS } from './config';

require('./utils/utils');

const fs = require('fs');
const { STEAM_DATA_PATH } = require('./config');

function getExistingSteamData(): Map<number, any> {
  if (fs.existsSync(STEAM_DATA_PATH)) {
    return new Map(JSON.parse(fs.readFileSync(STEAM_DATA_PATH)));
  }
  return new Map();
}

function jsonToEnum(name: string, data: Set<string>) {
  const enums = Array.from(data).map(
    (d) => {
      const key = d.toLocaleUpperCase().replace(/[ -/]/g, '_');
      return `  ${key} = '${d}',`;
    },
  ).join('\n');
  return `export enum ${name} {\n${enums}\n}`;
}

export async function runListTags(args) {
  const screenPrinter = new ScreenPrinter();
  const steamDataMap = getExistingSteamData();

  const END = steamDataMap.size;
  const tags = new Set<string>();
  const categories = new Set<string>();
  const reviews = new Set<string>();
  screenPrinter.setSuccessMessage(0, `Listing....${END}`);
  screenPrinter.setProgressBar(1, `${0} of ${END}`);
  let progress = 0;

  for (let [key, val] of steamDataMap) {
    if (val.tags) val.tags.forEach((t) => tags.add(t));
    if (val.categories) val.categories.forEach((c) => categories.add(c));
    if (val.reviewSummary) reviews.add(val.reviewSummary);
    screenPrinter.updateProgressBar(1, progress++, END);
    screenPrinter.updateMessage(1, `${progress} of ${END}`);
  }

  fs.writeFileSync(STEAM_TAGS, JSON.stringify(Array.from(tags)));
  fs.writeFileSync(STEAM_CATEGORIES, jsonToEnum('Categories', categories));
  fs.writeFileSync(STEAM_REVIEWS, jsonToEnum('Reviews', reviews));
}
