import { ScreenPrinter } from './console/ScreenPrinter';
import { BAZAR_PATH } from './config';
import { Bazar } from './interfaces/Bazar';
import { SteamMap } from './interfaces/SteamMap';
import { Categories } from './interfaces/Categories';
import { BazarSteam } from './interfaces/BazarSteam';
import { Reviews, reviewToNr } from './interfaces/Reviews';

require('./utils/utils');

const fs = require('fs');
const { STEAM_DATA_PATH } = require('./config');

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

function localMultiplayer(game: BazarSteam) {
  return game.tags && game.tags.find((t) => t.includes('Local'));
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

function printableObj(game: BazarSteam) {
  return [
    game.text,
    game.price.toString(),
    game.reviewSummary,
    'https://bazar.lowcygier.pl' + game.href,
  ];
}

export async function runList(args) {
  const screenPrinter = new ScreenPrinter();
  const bazar: Bazar[] = JSON.parse(fs.readFileSync(BAZAR_PATH));

  screenPrinter.setSuccessMessage(0, `Serching....`);

  const interesting = bazar
    .map(mapZlToNumber)
    .map(combineSteamAndBazar)
    .filter(onlyPositive)
    .filter(partialController)
    .filter(localMultiplayer)
    .sort(sortSteamBazar)
    .map(printableObj);

  if (interesting.length === 0) {
    screenPrinter.setErrorMessage(0, 'NOTHING INTERESTING FOUND!');
    return;
  }
  screenPrinter.setSuccessMessage(0, 'Results:');
  const sizes = [40, 7, 28, 50];
  screenPrinter.addTableHeader(1, ['name', 'price', 'reviews', 'href'], sizes);
  interesting.forEach((i, index) => {
    screenPrinter.addTableRow(index + 2, i, sizes);
  });
  screenPrinter.setSuccessMessage(interesting.length + 3, 'Total: ' + interesting.length);
  screenPrinter.print();
}
