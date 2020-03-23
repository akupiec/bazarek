import * as packageInfo from '../package.json';
import * as yargs from 'yargs';
import { CommandModule } from 'yargs';
import { runBazar } from './bazar-games';
import { runBazarToSteam } from './bazar-to-steam';
import { runSteamFetch } from './steam-data-fetch';
import {runCleanSteam} from "./clean-steam";

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

const steamCommand: CommandModule = {
  command: 'steam',
  describe: 'fetch steam tags & reviews',
  handler: (argv) => runSteamFetch(argv),
};

const cleanCommand: CommandModule = {
  command: 'clean',
  describe: 'clean steam data',
  handler: (argv) => runCleanSteam(argv),
};
yargs
  .command(bazarCommand)
  .command(mapLinksCommand)
  .command(steamCommand)
  .command(cleanCommand)
  .demandCommand(1, 'You need at least one command before moving on.')
  .help()
  .version(packageInfo.version).argv;
