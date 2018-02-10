const config = require('../../config');
const utils = require('../../utils/utils');
const SimSubject = require('../SimSubject');

const has = Object.prototype.hasOwnProperty;

class Unit extends SimSubject {
  constructor(parent) {
    super(parent);
    if (new.target === Unit) {
      throw new TypeError('Cannot construct a Unit directly!');
    }

    this.overrideRequiredFor(new.target, ['getAttackModifier', 'getDamage']);

    this.health = utils.rand(1, config.units.maxHp);
    this.recharge = utils.rand(config.units.recharge.min, config.units.recharge.max);

    this.rating = {
      hp: {
        needsUpdate: true,
        update: this.updateHpRating.bind(this),
        val: undefined,
      },
      dmg: {
        needsUpdate: true,
        update: this.updateDmgRating.bind(this),
        val: undefined,
      },
    };
  }

  getRating(coefs) {
    const resultRating = {};
    Object.keys(this.rating).forEach((key) => {
      if (this.rating[key].needsUpdate) {
        resultRating[key] = this.rating[key].update(coefs[key]);
        this.rating[key].needsUpdate = false;
      }
      resultRating[key] = this.rating[key].val;
    });
    return resultRating;
  }

  updateHpRating(hpCoef) {
    this.rating.hp.val = this.health * hpCoef;
    return this.rating.hp.val;
  }

  updateDmgRating(dmgCoef) {
    this.rating.dmg.val = this.getDamage(false) * dmgCoef;
    return this.rating.dmg.val;
  }


  getAttack() {
    const base = 0.5 * (1 + (this.health / 100));
    return base * this.getAttackModifier();
  }

  isActive() {
    if (this.health <= 0) {
      this.dump();
      return false;
    }
    if (this.children) {
      return super.isActive();
    }
    return false;
  }

  dump() {
    super.dump();
    if (has.call(this.parent, 'maxChildRecharge')) {
      if (this.parent.maxChildRecharge === this.recharge) {
        this.parent.getChildRecharge();
      }
    }
    if (has.call(this.parent, 'recalculateCoef')) {
      this.parent.recalculateCoef();
    }
  }

  overrideRequiredFor(overrider, fnArr) {
    fnArr.forEach((fn) => {
      if (typeof this[fn] === 'undefined') {
        throw new TypeError(`${overrider.name} class must override the method ${fn}`);
      }
    });
  }
}

module.exports = Unit;
