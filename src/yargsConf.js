const config = require('./config');

const yargsConf = {
  armies: {
    alias: ['a', 'nOfArmies'],
    describe: 'The number of armies on the battlefield',
    default: config.armies.min,
    type: 'number',
    min: config.armies.min,
    max: config.armies.max,
  },
};

module.exports = yargsConf;
