import { ScreenPrinter } from '../console/ScreenPrinter';
import { BazarSteamBuilder } from './bazar-steam/BazarSteamBuilder';
import { paintSteamBazar } from './bazar-steam/BazarSteamPainter';

export async function runGiveaway() {
  const screenPrinter = new ScreenPrinter();

  screenPrinter.setSuccessMessage(0, `Serching....`);
  const builder = new BazarSteamBuilder();

  const interesting = builder
    .onlyGiveaway()
    .sort()
    .getBazar();

  paintSteamBazar(interesting, screenPrinter);
}
