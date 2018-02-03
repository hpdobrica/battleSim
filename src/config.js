const utils = rootRequire('utils/utils');

let config = {
    armies:{
        alias: ['a', 'nOfArmies'],
        describe: 'The number of armies on the battlefield',
        default: undefined,
        type: 'number',
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    squads:{
        alias: ['s','nOfSquads'],
        describe: 'The number of squads in an army',
        default: undefined,
        type: 'number',
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    units:{
        alias: ['u', 'nOfUnits'],
        describe: 'The number of units inside of a squad',
        default: undefined,
        type: 'number',
        min: 5,
        max: 10,
        maxHp: 100,
        recharge: {
            min: 100,
            max: 2000
        },
        soldiers: {
            defaultXp: 0,
            maxXp: 50,

        },
        vehicles: {
            operators: {
                min: 1,
                max: 3
            },
            recharge: {
                min: 1000
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

//setting the defaults for yargs to use if params are not provided
config.armies.default = utils.rand(config.armies.min, 5);
config.squads.default = utils.rand(config.squads.min, 10);
config.units.default =  utils.rand(config.units.min, config.units.max);
config.strategy.default = config.strategy.choices[utils.rand(0,config.strategy.choices.length - 1)];

module.exports = config;