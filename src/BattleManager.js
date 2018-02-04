const Army = rootRequire('Military/Army/Army');

class BattleManager{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        //create armies
        this.children = [];
        for(let i = 0; i < nOfArmies; i++){
            this.children.push(new Army(nOfSquads, nOfUnits, strategy, this));
        }
        this.battleLoop();
        global.debug = this.children;
    }

    battleLoop(){
        for(let army of this.children){
            for(let squads of army.children){
                squads.initiateCombat(this.children);
            }
        }
    }

    isActive(){
        if(this.children.length <= 1){
            console.log("============= ITS OVER =============");
            process.exit(0);
        }else{
            return true;
        }


    }
}
module.exports = BattleManager;