import { BazarSteam } from './BazarSteam';
import { Categories } from '../../interfaces/Categories';
import { Reviews, reviewToNr } from '../../interfaces/Reviews';
import { NOT_INTERESTING, OWNED } from '../../../data/ignored-games';
import { GIVEAWAY_KEYS } from '../../../data/crap-budle';

export function onlyPositive(game: BazarSteam) {
  return game.reviewSummary && game.reviewSummary.includes('Positive');
}

export function partialController(game: BazarSteam) {
  return (
    game.categories.includes(Categories.FULL_CONTROLLER_SUPPORT) ||
    game.categories.includes(Categories.PARTIAL_CONTROLLER_SUPPORT)
  );
}

export function pricyNotAwsome(game: BazarSteam) {
  return (
    game.price < 10 ||
    game.reviewSummary === Reviews.OVERWHELMINGLY_POSITIVE ||
    game.reviewSummary === Reviews.MOSTLY_POSITIVE
  );
}

export function byTagsIncludes(tags: string[]) {
  return (game: BazarSteam) => {
    if (!game.tags) return false;
    return game.tags.find((gameTag) => tags.find((t) => gameTag.includes(t)));
  };
}

export function byTagsExcluded(tags: string[]) {
  return (game: BazarSteam) => {
    if (!game.tags) return false;
    return !byTagsIncludes(tags)(game);
  };
}

export function sortSteamBazar(a: BazarSteam, b: BazarSteam) {
  function sortByReview(a: BazarSteam, b: BazarSteam) {
    return reviewToNr(b.reviewSummary as Reviews) - reviewToNr(a.reviewSummary as Reviews);
  }

  function sortByPrice(a: BazarSteam, b: BazarSteam) {
    return a.price - b.price;
  }

  return sortByPrice(a, b) === 0 ? sortByReview(a, b) : sortByPrice(a, b);
}

export function excludeOwned(game: BazarSteam) {
  return !OWNED.includes(game.steamId + '');
}

export function excludeNotInteresting(game: BazarSteam) {
  return !(
    NOT_INTERESTING.includes('' + game.steamId) ||
    NOT_INTERESTING.find((n) => game.text.includes(n))
  );
}

export function onlyGiveaway(game: BazarSteam) {
  return GIVEAWAY_KEYS.find(name => game.text.includes(name));
}

export function excludeInGamePurchases(game: BazarSteam) {
  return !game.categories.includes(Categories.IN_APP_PURCHASES);
}

export function printableObj(game: BazarSteam) {
  return [
    game.text,
    game.price.toString(),
    game.reviewSummary,
    game.steamHref,
    // 'https://bazar.lowcygier.pl' + game.href,
  ];
}
