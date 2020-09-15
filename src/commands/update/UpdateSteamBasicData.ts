import { SteamDB, SteamI } from '../../db/model/SteamDB';
import { ScreenPrinter } from '../../console/ScreenPrinter';
import { DataBase } from '../../db/DataBase';
import { LogStatus } from '../../console/Interfaces';
import { myAxios as axios } from '../../utils/api';
import { JSDOM } from 'jsdom';
import { findNodeAndGetText } from '../../utils/htmlParsers/general';
import { Steam } from '../../utils/htmlParsers/Steam';
import { Op } from 'sequelize';
import moment from 'moment';
import { needUpdateOptions } from './config';

export class UpdateSteamBasicData {
  steamDatas: SteamI[] = [];

  constructor(private screenPrinter: ScreenPrinter, private db: DataBase) {}

  async run() {
    const steam = await this.db.findAll<SteamDB>(SteamDB, needUpdateOptions);
    const total = steam.length;
    this.screenPrinter.log('Downloading basic steam data');
    this.screenPrinter.setProgress(0, total);

    let idx = 0;
    const promises = steam.map(async (s) => {
      this.steamDatas.push(await Steam.getSteamData(s));
      this.screenPrinter.setProgress(idx++, total);
    });
    await Promise.allSettled(promises).then(async () => {
      await SteamDB.updateAll(this.steamDatas);
      this.steamDatas = [];
    });

    this.screenPrinter.setProgress(0, 0);
    this.screenPrinter.log('Linking done!', LogStatus.Success);
  }
}
