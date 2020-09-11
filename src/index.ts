import * as yargs from 'yargs';
import { updateCommand } from './commands/UpdateCommand';

// const bazarCommand: CommandModule = {
//   command: 'bazar',
//   describe: '1. fetch bazar data (all)',
//   handler: (argv) => runBazar(argv),
// };
//
// const mapLinksCommand: CommandModule = {
//   command: 'links',
//   describe: '2. create steam game list (bazar + wishList)',
//   handler: () => runSteam(),
// };
//
// const steamCommand: CommandModule = {
//   command: 'steam',
//   describe: '3. fetch steam tags & reviews',
//   handler: (argv) => runSteamFetch(argv),
// };
//
// const cleanCommand: CommandModule = {
//   command: 'clean',
//   describe: 'x. clean old steam data',
//   handler: (argv) => runCleanSteam(argv),
// };
//
// const ctCommand: CommandModule = {
//   command: 'create-tags-list',
//   aliases: ['ct'],
//   describe: '4. create tag & categories lists',
//   handler: () => runListTags(),
// };

// const interestingCommand: CommandModule = {
//   command: 'show-interesting-offers',
//   aliases: ['show'],
//   describe: '5. read and filters fetched data',
//   handler: () => runList(),
// };

// const wishListCommand: CommandModule = {
//   command: 'show-wishlist-offers',
//   aliases: ['wish'],
//   describe: '5. display wishlist',
//   handler: () => runWishList(),
// };

// const ownedCommand: CommandModule = {
//   command: 'show-giveaway-offers',
//   aliases: ['give', 'own'],
//   describe: '5. display giveaway list',
//   handler: () => runGiveaway(),
// };

yargs
  .command(updateCommand())
  // .command(mapLinksCommand)
  // .command(steamCommand)
  // .command(ctCommand)
  // .command(interestingCommand)
  // .command(wishListCommand)
  // .command(ownedCommand)
  // .command(cleanCommand)
  .demandCommand(1, 'You need at least one command before moving on.')
  .help()
  .version('1.0').argv;
