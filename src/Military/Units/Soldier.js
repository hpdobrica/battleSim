const Unit = require('./Unit');
const utils = rootRequire('utils/utils');

class Soldier extends Unit{
    constructor(parent){
        super(parent);
        this.xp = 0;
    }

    _getAttackModifier(){
        return utils.rand(30+this.xp, 100) / 100;
    }

    getDamage(){
        return 0.05 + this.xp / 100;
    }

    dump(){
        let container = undefined;
        if(typeof parent === Unit){
            container = 'operators'
        }else{
            container = 'members'
        }

        let index = this.parent[container].indexOf(this);
        if (index > -1) {
            this.parent[container].splice(index, 1);
            this.parent.isActive();
        }

    }
}

module.exports = Soldier;