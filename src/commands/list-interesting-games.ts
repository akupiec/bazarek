import { ScreenPrinter } from '../console/ScreenPrinter';
import { BazarSteamBuilder } from './bazar-steam/BazarSteamBuilder';
import { paintSteamBazar } from './bazar-steam/BazarSteamPainter';

export async function runList() {
  const screenPrinter = new ScreenPrinter();

  screenPrinter.setSuccessMessage(0, `Serching....`);
  const builder = new BazarSteamBuilder();

  const interesting = builder
    // .onlyGiveaway()
    .excludeOwned()
    .excludeNotInteresting()
    .onlyPositive()
    // .excludeInGamePurchases()
    .byTagsIncludes(['Hack and Slash'])
    // .byTagsIncludes(['Local'])
    // .partialController()
    .pricyNotAwsome()
    .sort()
    .getBazar();

  paintSteamBazar(interesting, screenPrinter);
}