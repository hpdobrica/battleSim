const config = rootRequire('config');
const utils = rootRequire('utils/utils');

class Unit{
    constructor(){
        if (new.target === Unit) {
            throw new TypeError("Cannot construct a Unit directly!");
        }
        if (typeof this._getAttackModifier !== "function") {
            throw new TypeError(new.target.name + "class must override the method _getAttackModifier");
        }

        this.health = utils.rand(1, config.units.maxHp);
        this.recharge = utils.rand(config.units.recharge.min, config.units.recharge.max);
    }

    getAttack(){
        let base = 0.5 * (1 + this.health/100);
        return base * this._getAttackModifier();
    }
}

module.exports = Unit;

//
// Attack Soldiers
// Soldiers attack success probability is calculated as follows:
// 0.5 * (1 + health/100) * random (30 + experience, 100) / 100
// ‘​
// random’ (min, max)​
//  returns a random number between min and max (inclusive)
//
//
// Attack vehicle
// The vehicle attack success probability is determined as follows:
// 0.5 * (1 + vehicle.health / 100) * gavg(operators.attack_success)
// ‘​
// gavg’​
//  is the geometric average of the attack success of all vehicle operators
//
//
