global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
};

const BattleManager = rootRequire('Military/BattleManager');
const config = rootRequire('config');
const yargsConf = rootRequire('yargsConf');

const argv = require('yargs')
  .options(yargsConf)
  .check((args) => {
    for (let key in config) {
      if (config.hasOwnProperty(key) && ['armies', 'squads', 'units'].includes(key)) {
        if (!(args[key] >= config[key].min && args[key] <= config[key].max)) {
          throw (new Error(`Argument check failed: ${key} must be between ${config[key].min} and ${config[key].max}`));
        }
      }
    }
    return true;
  })
  .help()
  .argv;

let bm = new BattleManager(argv.nOfArmies);
