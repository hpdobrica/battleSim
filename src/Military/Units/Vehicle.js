const Unit = require('./Unit');
const Soldier = require('./Soldier');
const utils = require('../../utils/utils');
const config = require('../../config');

class Vehicle extends Unit {
  constructor(parent) {
    super(parent);


    this.children = [];
    const numOfOperators = utils.rand(config.units.vehicles.operators.min, config.units.vehicles.operators.max);
    for (let i = 0; i < numOfOperators; i += 1) {
      this.children.push(new Soldier(this));
    }

    this.recharge = utils.rand(config.units.vehicles.recharge.min, config.units.recharge.max);
  }

  getAttackModifier() {
    return utils.gAvg(this.children, 'getAttack', true);
  }

  updateHpRating(hpCoef) {
    let avgOpHealth = this.children.reduce((sum, operator) => sum + operator.health, 0);

    avgOpHealth /= this.children.length;
    this.rating.hp.val = (this.health + avgOpHealth) * hpCoef;
    this.rating.hp.needsUpdate = false;
    return this.rating.hp.val;
  }


  getDamage(isAttack = true) {
    const sum = this.children.reduce((res, operator) => {
      res += operator.xp / 100; // eslint-disable-line no-param-reassign
      if (isAttack && operator.xp < 50) {
        operator.xp += 1;
        this.rating.dmg.needsUpdate = true;
      }
      return res;
    }, 0);
    return 0.1 + sum;
  }


  takeDamage(dmg) {
    const toVehicle = dmg * 0.3;
    const toRandomChild = dmg * 0.5;
    const toOtherChildren = dmg * 0.2;

    this.health -= toVehicle;
    if (this.health <= 0) {
      return this.dump();
    }

    const chosenChild = this.children[utils.rand(0, this.children.length - 1)];

    chosenChild.takeDamage(toRandomChild);
    const initialCount = this.children.length;
    if (initialCount === 1 && !chosenChild.health > 0) {
      // if there is no one else to take the damage
      this.health -= toOtherChildren;
    } else {
      this.children.forEach((child) => {
        if (child !== chosenChild) {
          child.takeDamage(toOtherChildren / (this.children.length - (initialCount > this.children.length ? 0 : 1)));
        }
      });
    }
    this.rating.hp.needsUpdate = true;
    this.rating.dmg.needsUpdate = true;
    return null;
  }
}

module.exports = Vehicle;
