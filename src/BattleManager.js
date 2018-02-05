const Army = rootRequire('Military/Army/Army');

class BattleManager{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        //create armies
        this.children = [];
        for(let i = 0; i < nOfArmies; i++){
            this.children.push(new Army(nOfSquads, nOfUnits, strategy, this));
        }
        this.startBattle(strategy);
        global.debug = this.children;
    }

    startBattle(strategy){
        //calculate everyone's rating
        for(let army of this.children){
            for(let squad of army.children){
                squad.updateRating();
            }
        }
        //sort squads
        if(strategy !== "random"){
            for(let army of this.children){
                army.children.sort((a,b) => {
                    if(strategy === "strongest"){
                        return b.rating - a.rating;
                    }else{
                        return b.rating + a.rating;
                    }

                })
            }
            //sort armies
            this.children.sort((a,b) => {
                if(strategy === "strongest") {
                    return b.children[0].rating - a.children[0].rating;
                }else{
                    return b.children[0].rating + a.children[0].rating;
                }
            });
        }
        //let the games begin
        for(let army of this.children){
            for(let squad of army.children){
                squad.initiateCombat(this.children);
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

    keepBattlefieldSorted(strategy){

        this.children.sort((a, b) => {
            if(strategy === "strongest"){
                return b.children[0].rating - a.children[0].rating;
            }else{
                return b.children[0].rating + a.children[0].rating;
            }

        })
    }
}
module.exports = BattleManager;