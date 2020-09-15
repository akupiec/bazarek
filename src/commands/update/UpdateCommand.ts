import { CommandModule } from 'yargs';
import { ScreenPrinter } from '../../console/ScreenPrinter';
import { DataBase } from '../../db/DataBase';
import { UpdateBazarData } from './UpdateBazarData';
import { UpdateBazarSteamLinks } from './UpdateBazarSteamLinks';
import { UpdateSteamBasicData } from './UpdateSteamBasicData';

class UpdateCommand {
  private screenPrinter = new ScreenPrinter();
  private db = new DataBase();

  async run() {
    await this.db.isReady;
    await new UpdateBazarData(this.screenPrinter, this.db).run();
    await new UpdateBazarSteamLinks(this.screenPrinter, this.db).run();
    await new UpdateSteamBasicData(this.screenPrinter, this.db).run();
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
