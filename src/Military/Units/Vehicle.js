const Unit = require('./Unit');
const Soldier = rootRequire('Military/Units/Soldier');
const utils = rootRequire('utils/utils');
const config = rootRequire('config');

class Vehicle extends Unit{
    constructor(parent){
        super(parent);

        this.children = [];
        let numOfOperators = utils.rand(config.units.vehicles.operators.min,config.units.vehicles.operators.max);
        for(let i = 0;i<numOfOperators;i++){
            this.children.push(new Soldier(this));
        }

        this.recharge = utils.rand(config.units.vehicles.recharge.min, config.units.recharge.max);

    }

    _getAttackModifier(){
        return utils.gAvg(this.children, "getAttack", true);

    }

    getDamage(){
        let sum = 0;
        for(let operator of this.children){
            sum += operator.xp / 100;
        }
        return 0.1 + sum;
    }




}

module.exports = Vehicle;