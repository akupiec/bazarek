import { ScreenPrinter } from '../../console/ScreenPrinter';
import { DataBase } from '../../db/DataBase';
import moment from 'moment';
import { BazarekDB } from '../../db/model/BazarekDB';
import { Op } from 'sequelize';
import { SteamDB } from '../../db/model/SteamDB';
import { LogStatus } from '../../console/Interfaces';
import { myAxios as axios } from '../../utils/api';
import { JSDOM } from 'jsdom';
import { Bazarek } from '../../utils/htmlParsers/Bazarek';
import { needUpdateOptions } from './config';

export class UpdateBazarSteamLinks {
  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {}

  async run() {
    const bazarek = await this.db.findAll<BazarekDB>(BazarekDB, {
      where: {
        [Op.or]: {
          updatedAt: {
            [Op.lt]: needUpdateOptions.where,
          },
          offerId: null,
        },
      },
      attributes: ['id', 'updatedAt'],
    });
    this.screenPrinter.log('Downloading steam links');
    this.screenPrinter.setProgress(0, bazarek.length);

    let idx = 0;
    const promises = bazarek.map(async (b) => {
      const dataToSave = await Bazarek.getSteamData(b);
      if (!dataToSave.steamId) {
        b.offerId = dataToSave.offerId;
        b.changed('updatedAt', true);
        await b.save();
      }
      if (dataToSave.steamHref && dataToSave.steamId) {
        await this.db.insert({ id: dataToSave.steamId, href: dataToSave.steamHref }, SteamDB);
        b.steamId = dataToSave.steamId;
        b.offerId = dataToSave.offerId;
        await b.save();
      }
      this.screenPrinter.setProgress(idx++, bazarek.length);
      return;
    });
    await Promise.all(promises);

    this.screenPrinter.setProgress(0, 0);
    this.screenPrinter.log('Linking done!', LogStatus.Success);
  }
}
