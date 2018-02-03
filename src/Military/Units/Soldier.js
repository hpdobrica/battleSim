const Unit = require('./Unit');
const utils = rootRequire('utils/utils');

class Soldier extends Unit{
    constructor(){
        super();
        this.xp = 0;
    }

    _getAttackModifier(){
        return utils.rand(30+this.xp, 100) / 100;
    }
}

module.exports = Soldier;