import { ScreenPrinter } from '../console/ScreenPrinter';
import { BAZAR_PATH } from '../config';
import { Bazar } from '../interfaces/Bazar';
import { SteamMap } from '../interfaces/SteamMap';
import { Categories } from '../interfaces/Categories';
import { BazarSteam } from '../interfaces/BazarSteam';
import { Reviews, reviewToNr } from '../interfaces/Reviews';
import { NOT_INTERESTING, OWNED } from '../../data/ignored-games';
import { GIVEAWAY_KEYS } from '../../data/crap-budle';

require('./utils/utils');

const fs = require('fs');
const { STEAM_DATA_PATH } = require('../config');

const steamDataMap: Map<number, SteamMap> = new Map(JSON.parse(fs.readFileSync(STEAM_DATA_PATH)));

function combineSteamAndBazar(game: Bazar): BazarSteam {
  return { ...game, ...steamDataMap.get(game.id) } as BazarSteam;
}
function mapZlToNumber(game: Bazar) {
  let price: any = (game && game.price) || '';
  price = price.slice(0, -2).replace(',', '.');
  price = parseFloat(price);
  return { ...game, price };
}

function onlyPositive(game: BazarSteam) {
  return game.reviewSummary && game.reviewSummary.includes('Positive');
}

function partialController(game: BazarSteam) {
  return (
    game.categories.includes(Categories.FULL_CONTROLLER_SUPPORT) ||
    game.categories.includes(Categories.PARTIAL_CONTROLLER_SUPPORT)
  );
}

function pricyNotAwsome(game: BazarSteam) {
  return (
    game.price < 10 ||
    game.reviewSummary === Reviews.OVERWHELMINGLY_POSITIVE ||
    game.reviewSummary === Reviews.MOSTLY_POSITIVE
  );
}

function byTagsIncludes(tags: string[]) {
  return (game: BazarSteam) => {
    if (!game.tags) return false;
    return game.tags.find((gameTag) => tags.find((t) => gameTag.includes(t)));
  };
}

function byTagsExcluded(tags: string[]) {
  return (game: BazarSteam) => {
    if (!game.tags) return false;
    return !byTagsIncludes(tags)(game);
  };
}

function sortSteamBazar(a: BazarSteam, b: BazarSteam) {
  function sortByReview(a: BazarSteam, b: BazarSteam) {
    return reviewToNr(b.reviewSummary as Reviews) - reviewToNr(a.reviewSummary as Reviews);
  }

  function sortByPrice(a: BazarSteam, b: BazarSteam) {
    return a.price - b.price;
  }

  return sortByPrice(a, b) === 0 ? sortByReview(a, b) : sortByPrice(a, b);
}

function onlyUniq(game: Bazar, idx: number, array: Bazar[]) {
  return array.findIndex((g) => g.id === game.id) === idx;
}

function excludeOwned(game: BazarSteam) {
  return !OWNED.includes(game.steamId + '');
}

function excludeNotInteresting(game: BazarSteam) {
  return !(
    NOT_INTERESTING.includes('' + game.steamId) ||
    NOT_INTERESTING.find((n) => game.text.includes(n))
  );
}

function onlyGiveaway(game: BazarSteam) {
  return GIVEAWAY_KEYS.find(name => game.text.includes(name));
}

function excludeInGamePurchases(game: BazarSteam) {
  return !game.categories.includes(Categories.IN_APP_PURCHASES);
}

function printableObj(game: BazarSteam) {
  return [
    game.text,
    game.price.toString(),
    game.reviewSummary,
    game.steamHref,
    // 'https://bazar.lowcygier.pl' + game.href,
  ];
}

export async function runList() {
  const screenPrinter = new ScreenPrinter();
  const bazar: Bazar[] = JSON.parse(fs.readFileSync(BAZAR_PATH));

  screenPrinter.setSuccessMessage(0, `Serching....`);

  const interesting = bazar
    .filter(onlyUniq)
    .map(mapZlToNumber)
    .map(combineSteamAndBazar)
    // .filter(onlyGiveaway)
    .filter(excludeOwned)
    .filter(excludeNotInteresting)
    .filter(onlyPositive)
    // .filter(excludeInGamePurchases)
    .filter(byTagsIncludes(['Hack and Slash']))
    // .filter(byTagsIncludes(['Local']))
    // .filter(partialController)
    .filter(pricyNotAwsome)
    .sort(sortSteamBazar)
    .map(printableObj);

  if (interesting.length === 0) {
    screenPrinter.setErrorMessage(0, 'NOTHING INTERESTING FOUND!');
    return;
  }
  screenPrinter.setSuccessMessage(0, 'Results:');
  const sizes = [40, 7, 28, 50];
  screenPrinter.addTableHeader(1, ['NAME', 'PRICE', 'REVIEWS', 'LINKS'], sizes);
  interesting.forEach((i, index) => {
    const colData = i.map(col => col || '');
    screenPrinter.addTableRow(index + 2, colData, sizes);
  });
  screenPrinter.setSuccessMessage(interesting.length + 3, 'Total: ' + interesting.length);
}
