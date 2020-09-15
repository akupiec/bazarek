import { ScreenPrinter } from '../../console/ScreenPrinter';
import { DataBase } from '../../db/DataBase';
import { BazarekDB } from '../../db/model/BazarekDB';
import { LogStatus } from '../../console/Interfaces';
import { Bazarek } from '../../utils/htmlParsers/Bazarek';
import { LAST_PAGE, needUpdateOptions, START_PAGE } from './config';

export class UpdateBazarData {
  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {}

  async run() {
    let progress = 1;
    const maxPages = LAST_PAGE;
    this.screenPrinter.log('Pulling BazarData');
    this.screenPrinter.spinner(`page: ${progress}`);

    const needUpdate = await this.db.count(BazarekDB, needUpdateOptions);
    const hasRecords = await this.db.count(BazarekDB, {});
    if (hasRecords && !needUpdate) {
      this.screenPrinter.log('All done', LogStatus.Success);
      this.screenPrinter.stopSpinner();
      return;
    }

    const promises: Promise<any>[] = [];
    for (let page = START_PAGE; page <= maxPages; page++) {
      const prom = this.fetchAndUpdateData(page);
      prom.then(() => {
        this.screenPrinter.spinner(`page: ${progress++}`);
      });
      promises.push(prom);
    }

    return Promise.all(promises).then(
      () => {
        this.screenPrinter.log('All done', LogStatus.Success);
        this.screenPrinter.stopSpinner();
      },
      (err) => {
        console.log(err);
        process.exit(-1);
      },
    );
  }

  private async fetchAndUpdateData(page: number) {
    const data = await Bazarek.getDataAtPage(page);
    await this.db.insupsRaw(data, BazarekDB);
    return;
  }
}
