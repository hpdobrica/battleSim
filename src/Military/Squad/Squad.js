const config = rootRequire('config');
const Soldier = rootRequire('Military/Units/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle');
const utils = rootRequire('utils/utils');

class Squad{
    constructor(nOfUnits = config.units.default,
                strategy = config.strategy.default,
                parent = undefined){

        this.parent = parent;
        this.target = null;
        this.strategy = strategy;
        this.members = [];

        nOfUnits = this._getUnitRatio(nOfUnits);

        for(let i = 0; i < nOfUnits.soldiers; i++){
            this.members.push(new Soldier(this));
        }
        for(let i = 0; i < nOfUnits.vehicles; i++){
            this.members.push(new Vehicle(this));
        }
    }

    _getUnitRatio(nOfUnits){
        let r = utils.rand(0,nOfUnits);
        return {
            soldiers: nOfUnits - r,
            vehicles: r
        }
    }

    getAttack(){
        return utils.gAvg(this.members, "getAttack", true);
    }

    getDamage(){
        let total = 0;
        for(let member of this.members){
            total += member.getAttack();
        }
        return total;
    }

    initiateCombat(armies){
        while(this.isActive()){

        }
    }

    isActive(){
        let stillAlive = false;
        for(let member of this.members){
            if(member.isActive()){
                stillAlive = true;
            }
        }
        if(stillAlive){
            return true;
        }else{
            this.dump();
            return false;
        }

    }

    dump(){
        let index = this.parent.squads.indexOf(this);
        if (index > -1) {
            this.parent.squads.splice(index, 1);
        }
    }

}

module.exports = Squad;