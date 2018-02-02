const BattleManager = require('./BattleManager');
const config = require('./config');
const helpers = require('./helpers');


const argv = require('yargs')
    .options({
        'armies':{
            alias: 'a',
            describe: 'The number of armies on the battlefield',
            default: helpers.rand(config.armies.min, 5),
            type: 'number'
        },
        'squads':{
            alias: 's',
            describe: 'The number of squads in an army',
            default: helpers.rand(config.squads.min, 10),
            type: 'number'
        },
        'units':{
            alias: 'u',
            describe: 'The number of units inside of a squad',
            default: helpers.rand(config.units.min, config.units.max),
            type: 'number'
        },
        'strategy':{
            alias: 't',
            describe: 'The attack strategy that units will use',
            choices:config.attackStrategies,
            default: config.attackStrategies[helpers.rand(0,config.attackStrategies.length - 1)],
            type: 'string'
        },

    })
    .check((argv) =>{
        for(let property in config){
            if(['armies','squads','units'].includes(property)){
                if(!(argv[property] >= config[property].min && argv[property] <= config[property].max)){



                    if(property !== 'units'){
                        throw(new Error(`Argument check failed: ${property} must be ${config[property].min} <= n`));
                    }else{
                        throw(new Error(`Argument check failed: ${property} must be between ${config[property].min} and ${config[property].max}`));
                    }
                }
            }
            if(property === 'attackStrategies'){
                if(!(config[property].includes(argv.strategy))){
                    throw(new Error(`Argument check failed: invalid attack strategy `));
                }
            }
        }
        return true;
    })
    .help()
    .argv;

console.log(argv);

let bm = new BattleManager();




