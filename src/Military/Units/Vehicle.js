const Unit = require('./Unit');
const Soldier = rootRequire('Military/Units/Soldier');
const utils = rootRequire('utils/utils');
const config = rootRequire('config');

class Vehicle extends Unit{
    constructor(parent){
        super(parent);

        this.operators = [];
        let numOfOperators = utils.rand(config.units.vehicles.operators.min,config.units.vehicles.operators.max);
        for(let i = 0;i<numOfOperators;i++){
            this.operators.push(new Soldier());
        }

        this.recharge = utils.rand(config.units.vehicles.recharge.min, config.units.recharge.max);

    }

    _getAttackModifier(){
        return utils.gAvg(this.operators, "getAttack", true);

    }

    getDamage(){
        let sum = 0;
        for(let operator of this.operators){
            sum += operator.xp / 100;
        }
        return 0.1 + sum;
    }

    isActive(){
        if(this.health < 1){
            this.dump();
            return false;
        }

        let stillAlive = false;
        for(let operator of this.operators){
            if(operator.isActive()){
                stillAlive = true;
            }
        }
        return stillAlive;
    }


}

module.exports = Vehicle;