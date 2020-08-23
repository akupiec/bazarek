import { ScreenPrinter } from '../console/ScreenPrinter';
import { BazarSteamBuilder } from './bazar-steam/BazarSteamBuilder';
import { paintSteamBazar } from './bazar-steam/BazarSteamPainter';

export async function runWishList() {
  const screenPrinter = new ScreenPrinter();

  screenPrinter.setSuccessMessage(0, `Serching....`);
  const builder = new BazarSteamBuilder();

  const interesting = builder
    .onlyWishList()
    .sort()
    .getBazar();

  paintSteamBazar(interesting, screenPrinter);
}
