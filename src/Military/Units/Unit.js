const config = rootRequire('config');
const utils = rootRequire('utils/utils');
const SimSubject = rootRequire('Military/SimSubject');

const has = Object.prototype.hasOwnProperty;

class Unit extends SimSubject {
  constructor(parent) {
    super(parent);
    if (new.target === Unit) {
      throw new TypeError('Cannot construct a Unit directly!');
    }

    this._overrideRequiredFor(new.target, ['_getAttackModifier', 'getDamage']);

    this.health = utils.rand(1, config.units.maxHp);
    this.recharge = utils.rand(config.units.recharge.min, config.units.recharge.max);

    this.rating = {
      hp: {
        needsUpdate: true,
        update: this._updateHpRating.bind(this),
        val: undefined,
      },
      dmg: {
        needsUpdate: true,
        update: this._updateDmgRating.bind(this),
        val: undefined,
      },
    };
  }

  getRating(coefs) {
    const resultRating = {};
    for (const property in this.rating) {
      if (has.call(this.rating, property)) {
        if (this.rating[property].needsUpdate) {
          resultRating[property] = this.rating[property].update(coefs[property]);
          this.rating[property].needsUpdate = false;
        }
        resultRating[property] = this.rating[property].val;
      }
    }
    return resultRating;
  }

  _updateHpRating(hpCoef) {
    this.rating.hp.val = this.health * hpCoef;
    return this.rating.hp.val;
  }

  _updateDmgRating(dmgCoef) {
    this.rating.dmg.val = this.getDamage(false) * dmgCoef;
    return this.rating.dmg.val;
  }


  getAttack() {
    const base = 0.5 * (1 + this.health / 100);
    return base * this._getAttackModifier();
  }

  isActive() {
    if (this.health <= 0) {
      this.dump();
      return false;
    }
    if (this.children) {
      return super.isActive();
    }
  }

  dump() {
    super.dump();
    if (has.call(this.parent, 'maxChildRecharge')) {
      if (this.parent.maxChildRecharge === this.recharge) {
        this.parent._getChildRecharge();
      }
    }
    if (has.call(this.parent, 'recalculateCoef')) {
      this.parent.recalculateCoef();
    }
  }

  _overrideRequiredFor(overrider, fnArr) {
    fnArr.forEach((fn) => {
      if (typeof this[fn] === 'undefined') {
        throw new TypeError(`${overrider.name} class must override the method ${fn}`);
      }
    });
  }
}

module.exports = Unit;
