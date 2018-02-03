const Army = rootRequire('Military/Army/Army');

class BattleManager{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        //create armies
        this.armies = [];
        for(let i = 0; i < nOfArmies; i++){
            this.armies.push(new Army(nOfSquads, nOfUnits, strategy));
        }
    }

    battleLoop(){
        for(let army of this.armies){
            for(let squads of army){
                squads.initiateCombat(this.armies);
            }
        }
    }
}
module.exports = BattleManager;