const Army = rootRequire('Military/Army/Army');

class BattleManager{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        //create armies
        this.children = [];
        for(let i = 0; i < nOfArmies; i++){
            this.children.push(new Army(nOfSquads, nOfUnits, strategy, this));
        }
        this.battleLoop();
    }

    battleLoop(){
        for(let army of this.children){
            for(let squads of army.children){
                console.log("CALLING INITIATE");
                squads.initiateCombat(this.children);
            }
        }
    }

    isActive(){
        console.log("============= ITS OVER =============")
    }
}
module.exports = BattleManager;