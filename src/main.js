const BattleManager = require('./Military/BattleManager');
const yargsConf = require('./yargsConf');

const argv = require('yargs') // eslint-disable-line prefer-destructuring
  .options(yargsConf)
  .help()
  .argv;

const bm = new BattleManager(argv.nOfArmies); // eslint-disable-line no-unused-vars
