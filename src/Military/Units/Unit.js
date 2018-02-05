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

        this.health = utils.rand(1, config.units.maxHp);
        this.recharge = utils.rand(config.units.recharge.min, config.units.recharge.max);

        this.rating = {
            hp: {
                needsUpdate: true,
                update: this._updateHpRating.bind(this),
                val: undefined
            },
            dmg: {
                needsUpdate: true,
                update: this._updateDmgRating.bind(this),
                val: undefined
            }
        }
    }

    getRating(coefs){
        let resultRating = {};
        for(let property in this.rating){
            if(this.rating.hasOwnProperty(property)){
                if(this.rating[property].needsUpdate){
                    resultRating[property] = this.rating[property].update(coefs[property]);
                    this.rating[property].needsUpdate = false;
                }
                resultRating[property] = this.rating[property].val;
            }
        }
        return resultRating;
    }

    _updateHpRating(hpCoef){
        this.rating.hp.val = this.health * hpCoef;
        return this.rating.hp.val;
    }

    _updateDmgRating(dmgCoef){
        this.rating.dmg.val = this.getDamage(false) * dmgCoef;
        return this.rating.dmg.val;
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
        if(this.parent.hasOwnProperty('recalculateCoef')){
            this.parent.recalculateCoef();
        }
    }

    _overrideRequiredFor(overrider, fnArr){
        for(let fn of fnArr){
            if (typeof this[fn] === "undefined") {
                throw new TypeError(`${overrider.name} class must override the method ${fn}`);
            }
        }
    }


}

module.exports = Unit;
