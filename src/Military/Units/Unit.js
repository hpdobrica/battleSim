const config = rootRequire('config');
const utils = rootRequire('utils/utils');
const SimSubject = rootRequire('Military/SimSubject');

class Unit extends SimSubject{
    constructor(parent){
        super(parent);
        if (new.target === Unit) {
            throw new TypeError("Cannot construct a Unit directly!");
        }
        this._overrideRequiredFor(new.target,['_getAttackModifier','getDamage']);
        this.parent = parent;
        this.health = utils.rand(1, config.units.maxHp);
        this.recharge = utils.rand(config.units.recharge.min, config.units.recharge.max);
    }

    getAttack(){
        let base = 0.5 * (1 + this.health/100);
        return base * this._getAttackModifier();
    }

    isActive(){
        if(this.health <= 0){
            this.dump();
            return false;
        }
        if(this.children){
            return super.isActive();
        }


    }

    dump(){
        super.dump();
        if(this.parent.hasOwnProperty('maxChildRecharge')){
            if(this.parent.maxChildRecharge === this.recharge){
                this.parent._getChildRecharge()
            }
        }
    }


}

module.exports = Unit;
