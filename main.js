const BattleManager = require('./BattleManager');
const config = require('./config');
const helpers = require('./helpers');


const argv = require('yargs')
    .options(config)
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




