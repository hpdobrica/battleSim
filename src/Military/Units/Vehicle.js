const Unit = require('./Unit');

class Vehicle extends Unit{
    constructor(){
        super();
        this.operatorns = null;
    }

    _getAttackModifier(){
        // gavg(operators.attack_success)

    }
}

module.exports = Vehicle;