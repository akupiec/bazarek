import * as packageInfo from '../package.json';
import * as yargs from 'yargs';
import { CommandModule } from 'yargs';
import { runBazar } from './commands/bazar-games';
import { runBazarToSteam } from './commands/bazar-to-steam';
import { runSteamFetch } from './commands/steam-data-fetch';
import { runCleanSteam } from './commands/clean-steam';
import { runListTags } from './commands/list-tags-steam';
import { runList } from './commands/list-interesting-games';

const bazarCommand: CommandModule = {
  command: 'bazar',
  describe: '1. fetch bazar data',
  handler: (argv) => runBazar(argv),
};

const mapLinksCommand: CommandModule = {
  command: 'links',
  describe: '2. fetch steam links based on bazar data',
  handler: () => runBazarToSteam(),
};

const steamCommand: CommandModule = {
  command: 'steam',
  describe: '3. fetch steam tags & reviews',
  handler: (argv) => runSteamFetch(argv),
};

const cleanCommand: CommandModule = {
  command: 'clean',
  describe: 'x. clean steam data',
  handler: (argv) => runCleanSteam(argv),
};

const ctCommand: CommandModule = {
  command: 'create-tags-list',
  aliases: ['ct'],
  describe: '4. create tag & categories lists',
  handler: () => runListTags(),
};

const interestingCommand: CommandModule = {
  command: 'show-interesting-offers',
  aliases: ['show'],
  describe: '5. read and filters fetched data',
  handler: () => runList(),
};

yargs
  .command(bazarCommand)
  .command(mapLinksCommand)
  .command(steamCommand)
  .command(ctCommand)
  .command(interestingCommand)
  .command(cleanCommand)
  .demandCommand(1, 'You need at least one command before moving on.')
  .help()
  .version(packageInfo.version).argv;
