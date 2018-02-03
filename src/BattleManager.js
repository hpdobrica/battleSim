let Army = require('./Military/Army');

class BattleManager{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        //create armies
        this.armies = [];
        for(let i = 0; i < nOfArmies; i++){
            this.armies.push(new Army(nOfSquads, nOfUnits, strategy));
        }
    }

}
module.exports = BattleManager;