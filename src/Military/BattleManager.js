const Army = rootRequire('Military/Groups/Army/Army');
const Group = rootRequire('Military/Groups/Group');

class BattleManager extends Group{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        super(null);

        //create armies
        for(let i = 0; i < nOfArmies; i++){
            this.children.push(new Army(nOfSquads, nOfUnits, strategy, this));
        }
        this.startBattle(strategy);
        global.debug = this.children; //todo remove this
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

    _needsToMove(modifiedChild, direction, index){
        if(this.children[index + direction]) {
            return direction === -1 && modifiedChild.rating > this.children[index + direction].children[0].rating ||
                direction === 1 && modifiedChild.rating < this.children[index + direction].children[0].rating;
        }else{
            return false;
        }
    }

    keepChildrenSorted(modifiedChild, oldRating, strategy){
        modifiedChild.rating = modifiedChild.children[0].rating;
        super.keepChildrenSorted(modifiedChild, oldRating, strategy)

    }

    dump(){
        throw new Error('Can\'t dump the battle manager!')
    }
    getParentIndex(){
        throw new Error('Battle manager has no parent!');
    }

}
module.exports = BattleManager;