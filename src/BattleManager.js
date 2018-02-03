const Army = rootRequire('Military/Army/Army');
// let Squad = rootRequire('Military/Squad/Squad');

class BattleManager{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        //create armies
        console.log("armies:",nOfArmies, "squads:",nOfSquads, "units:",nOfUnits, "strategy:",strategy);
        this.armies = [];
        for(let i = 0; i < nOfArmies; i++){
            console.log("calling new Army with|", "squads:",nOfSquads, "units:",nOfUnits, "strategy:",strategy);
            this.armies.push(new Army(nOfSquads, nOfUnits, strategy));
        }
    }

}
module.exports = BattleManager;