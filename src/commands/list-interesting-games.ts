import { ScreenPrinter } from '../console/ScreenPrinter';
import { BazarSteamBuilder } from './bazar-steam/BazarSteamBuilder';

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
    .getPritable();

  if (interesting.length === 0) {
    screenPrinter.setErrorMessage(0, 'NOTHING INTERESTING FOUND!');
    return;
  }
  screenPrinter.setSuccessMessage(0, 'Results:');
  const sizes = [40, 7, 28, 50];
  screenPrinter.addTableHeader(1, ['NAME', 'PRICE', 'REVIEWS', 'LINKS'], sizes);
  interesting.forEach((i, index) => {
    const colData = i.map((col) => col || '');
    screenPrinter.addTableRow(index + 2, colData, sizes);
  });
  screenPrinter.setSuccessMessage(interesting.length + 3, 'Total: ' + interesting.length);
}
