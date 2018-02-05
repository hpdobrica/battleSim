const config = rootRequire('config');

let yargsConf = {
    armies:{
        alias: ['a', 'nOfArmies'],
        describe: 'The number of armies on the battlefield',
        default: config.armies.min,
        type: 'number',
        min: config.armies.min,
        max: config.armies.max
    },
    squads:{
        alias: ['s','nOfSquads'],
        describe: 'The number of squads in an army',
        default: config.squads.min,
        type: 'number',
        min: config.squads.min,
        max: config.squads.max
    },
    units: {
        alias: ['u', 'nOfUnits'],
        describe: 'The number of units inside of a squad',
        default: config.units.min,
        type: 'number',
        min: config.units.min,
        max: config.units.max
    },
    strategy: {
        alias: 't',
        describe: 'The attack strategy that units will use',
        choices: config.strategy.choices,
        default: config.strategy.choices[0],
        type: 'string'
    },
};

module.exports = yargsConf;