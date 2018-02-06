const Army = rootRequire('Military/Groups/Army/Army');
const Group = rootRequire('Military/Groups/Group');
const armyNames = rootRequire('Military/Groups/Army/armyNames');
const utils = rootRequire('utils/utils');

class BattleManager extends Group{
    constructor({nOfArmies, nOfSquads, nOfUnits, strategy}){
        super(null);
        let usedNames = [[]];
        let usedNamesIndex = 0;
        let tmpArmyNames = armyNames.slice(0);
        //create armies
        for(let i = 0; i < nOfArmies; i++){
            let name;
            if(usedNames[usedNamesIndex].length === armyNames.length){
                usedNamesIndex++;
                tmpArmyNames = armyNames.slice(0);
                usedNames[usedNamesIndex] = [];
            }

            let random = utils.rand(0,tmpArmyNames.length - 1);
            name = tmpArmyNames[random];
            tmpArmyNames.splice(tmpArmyNames.indexOf(name), 1);

            usedNames[usedNamesIndex].push(name);
            this.children.push(new Army(nOfSquads, nOfUnits, strategy, this, `${name} Army ${usedNamesIndex > 0 ? "#" + (usedNamesIndex+1): ""}` ));
        }
        this.startBattle(strategy);
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
        this._startLog();
    }

    isActive(){
        if(this.children.length <= 1){
            console.log("=+=+=+=+=+= IT'S OVER =+=+=+=+=+=");
            if(this.children.length !== 0){
                console.log(`${this.children[0].name} is victorious!`);
            }else{
                console.log('...but at what cost?');
            }

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

    _startLog(){
        console.log(`The battle between ${this.children.length} armies has begun!`);
        console.log('Armies:');
        for(let army of this.children) {
            console.log(` - ${army.name}`);
        }
        setInterval(() => {
            this.logBattleStatus();
        }, 10000);

    }

    logBattleStatus(){
        console.log("=+=+=+=+=+= Battle Status =+=+=+=+=+=");
        for(let army of this.children){
            console.log(`${army.name} (${army.children.length} squads)`);
            for(let [index, squad] of army.children.entries()){
                console.log(`# # Squad ${index+1} ~Rating:${+squad.rating.toFixed(2)}~ (${squad.children.length} units)`);
                for(let [index, unit] of squad.children.entries()){
                    let details = `health:${+unit.health.toFixed(1)},`;
                    if(unit.constructor.name === "Vehicle"){
                        details += ` operators: ${unit.children.length}`;
                    }else{
                        details += ` experience: ${unit.xp}`;
                    }
                    console.log(`# # # # ${unit.constructor.name} ${index+1} (${details})`);
                }
            }
        }
        console.log("=+=+=+=+=+= End of Battle Status =+=+=+=+=+=");
    }

}
module.exports = BattleManager;