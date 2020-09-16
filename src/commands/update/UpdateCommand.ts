import { CommandModule } from 'yargs';
import { ScreenPrinter } from '../../console/ScreenPrinter';
import { DataBase } from '../../db/DataBase';
import { UpdateBazarData } from './UpdateBazarData';
import { UpdateBazarSteamLinks } from './UpdateBazarSteamLinks';
import { UpdateSteamBasicData } from './UpdateSteamBasicData';

class UpdateCommand {
  private screenPrinter = new ScreenPrinter();
  private db = new DataBase();
  private updateSteamBasicData!: UpdateSteamBasicData;

  constructor() {
    //catches ctrl+c event
    process.on('SIGINT', async () => {
      await this.updateSteamBasicData.close();
      this.db.close();
      process.exit(0);
    });
  }

  async run() {
    await this.db.isReady;
    await new UpdateBazarData(this.screenPrinter, this.db).run();
    await new UpdateBazarSteamLinks(this.screenPrinter, this.db).run();
    this.updateSteamBasicData = new UpdateSteamBasicData(this.screenPrinter, this.db);
    await this.updateSteamBasicData.run();
  }
}

export function updateCommand(): CommandModule {
  return {
    command: 'update',
    aliases: ['fetch', 'init'],
    describe: 'fetch & update all require data',
    handler: () => {
      new UpdateCommand().run();
    },
  };
}
