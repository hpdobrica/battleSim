const config = rootRequire('config');
const utils = rootRequire('utils/utils');

class Unit{
    constructor(parent){
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
        if(this.health < 1){
            this.dump();
            return false;
        }
        return true;
    }

    dump(){
        let index = this.parent.members.indexOf(this);
        if (index > -1) {
            this.parent.members.splice(index, 1);
            this.parent.isActive();
        }
    }

    _overrideRequiredFor(overrider, fnArr){
        for(let fn of fnArr){
            if (typeof overrider[fn] === undefined) {
                throw new TypeError(`${overrider.name} class must override the method ${fn}`);
            }
        }
    }
}

module.exports = Unit;
