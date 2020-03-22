import * as packageInfo from '../package.json';
import * as yargs from 'yargs';
import { CommandModule } from 'yargs';
import { runBazar } from './bazar-games';
import { runBazarToSteam } from './bazar-to-steam';

const bazarCommand: CommandModule = {
  command: 'bazar',
  describe: 'fetch bazar data',
  handler: (argv) => runBazar(argv),
};

const mapLinksCommand: CommandModule = {
  command: 'links',
  describe: 'fetch steam links based on bazar data',
  handler: (argv) => runBazarToSteam(argv),
};
yargs
  .command(bazarCommand)
  .command(mapLinksCommand)
  .demandCommand(1, 'You need at least one command before moving on.')
  .help()
  .version(packageInfo.version).argv;
