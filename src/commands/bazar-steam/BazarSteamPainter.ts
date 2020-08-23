import { printableObj } from './mappers';
import { BazarSteam } from './BazarSteam';
import { ScreenPrinter } from '../../console/ScreenPrinter';

export function paintSteamBazar(bazarSteam: BazarSteam[], screenPrinter: ScreenPrinter) {
  const interesting = bazarSteam.map(printableObj);

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
