const utils = require('./utils/utils');

let config = {
    armies:{
        alias: 'a',
        describe: 'The number of armies on the battlefield',
        default: undefined,
        type: 'number',
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    squads:{
        alias: 's',
        describe: 'The number of squads in an army',
        default: undefined,
        type: 'number',
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    units:{
        alias: 'u',
        describe: 'The number of units inside of a squad',
        default: undefined,
        type: 'number',
        min: 5,
        max: 10,
        defaultHp: 100,
        soldiers: {
            defaultXp: 0,
            maxXp: 50,
            recharge: {
                min: 100,
                max: 2000
            },
        },
        vehicles: {
            operators: {
                min: 1,
                max: 3
            },
            recharge: {
                min: 1000,
                max: 2000
            },
        }
    },
    strategy: {
        alias: 't',
        describe: 'The attack strategy that units will use',
        choices: ['random', 'weakest', 'strongest'],
        default: undefined,
        type: 'string'
    },

};

//setting the defaults
config.armies.default = utils.rand(config.armies.min, 5);
config.squads.default = utils.rand(config.squads.min, 10);
config.units.default =  utils.rand(config.units.min, config.units.max);
config.strategy.default = config.strategy.choices[utils.rand(0,config.strategy.choices.length - 1)];

module.exports = config;