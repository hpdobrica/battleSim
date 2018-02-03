const BattleManager = require('./BattleManager');
const config = require('./config');

const argv = require('yargs')
    .options(config)
    .check((argv) =>{
        for(let key in config){
            if(config.hasOwnProperty(key) && ['armies','squads','units'].includes(key)){
                if(!(argv[key] >= config[key].min && argv[key] <= config[key].max)){
                    throw(new Error(`Argument check failed: ${key} must be between ${config[key].min} and ${config[key].max}`));
                }
            }
        }
        return true;
    })
    .help()
    .argv;

console.log(argv);

let bm = new BattleManager(argv);




