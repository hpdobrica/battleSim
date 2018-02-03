//defining root require to avoid ../../-ing. Using this instead of require.main.require in order to share it with the testing suite
global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
};

const BattleManager = rootRequire('BattleManager');
const config = rootRequire('config');

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




