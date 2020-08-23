import { Bazar } from '../../interfaces/Bazar';
import { BazarSteam } from './BazarSteam';
import { SteamMap } from '../../interfaces/SteamMap';
import { BAZAR_PATH } from '../../config';
import {
  byTagsExcluded,
  byTagsIncludes,
  excludeInGamePurchases,
  excludeNotInteresting,
  excludeOwned,
  onlyGiveaway,
  onlyPositive,
  onlyWishList,
  partialController,
  pricyNotAwsome,
  sortSteamBazar,
} from './mappers';

const fs = require('fs');
const { STEAM_DATA_PATH } = require('../../config');
require('../../utils/utils');


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

function onlyUniq(game: Bazar, idx: number, array: Bazar[]) {
  return array.findIndex((g) => g.id === game.id) === idx;
}

export function getBazarSteams() {
  const bazar: Bazar[] = JSON.parse(fs.readFileSync(BAZAR_PATH));
  return bazar.filter(onlyUniq).map(mapZlToNumber).map(combineSteamAndBazar);
}

export class BazarSteamBuilder {
  private bazarSteam: BazarSteam[];
  private _onlyGiveaway: boolean;

  constructor() {
    this.bazarSteam = getBazarSteams();
  }

  sort() {
    this.bazarSteam = this.bazarSteam.sort(sortSteamBazar);
    return this;
  }

  onlyGiveaway() {
    this.bazarSteam = this.bazarSteam.filter(onlyGiveaway);
    return this;
  }

  excludeOwned() {
    this.bazarSteam = this.bazarSteam.filter(excludeOwned);
    return this;
  }

  excludeNotInteresting() {
    this.bazarSteam = this.bazarSteam.filter(excludeNotInteresting);
    return this;
  }

  onlyPositive() {
    this.bazarSteam = this.bazarSteam.filter(onlyPositive);
    return this;
  }

  excludeInGamePurchases() {
    this.bazarSteam = this.bazarSteam.filter(excludeInGamePurchases);
    return this;
  }

  byTagsIncludes(strings: string[]) {
    this.bazarSteam = this.bazarSteam.filter(byTagsIncludes(strings));
    return this;
  }

  byTagsExcluded(strings: string[]) {
    this.bazarSteam = this.bazarSteam.filter(byTagsExcluded(strings));
    return this;
  }

  partialController() {
    this.bazarSteam = this.bazarSteam.filter(partialController);
    return this;
  }

  pricyNotAwsome() {
    this.bazarSteam = this.bazarSteam.filter(pricyNotAwsome);
    return this;
  }

  onlyWishList() {
    this.bazarSteam = this.bazarSteam.filter(onlyWishList);
    return this;
  }

  getBazar(): BazarSteam[] {
    return this.bazarSteam;
  }
}
