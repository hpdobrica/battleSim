const Unit = rootRequire('Military/Units/Unit');
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
        let dmg = 0.05 + this.xp / 100;
        if(this.xp < 50){
            this.xp++;
        }
        return dmg;
    }

    isActive(){
        if(this.health <= 0){
            this.dump();
            return false;
        }
        return true;
    }

    takeDamage(dmg){
        this.health -= dmg;
        if(this.health <= 0){
            this.dump();
        }
    }
}

module.exports = Soldier;