const Unit = rootRequire('Military/Units/Unit');
const Soldier = rootRequire('Military/Units/Soldier/Soldier');
const utils = rootRequire('utils/utils');
const config = rootRequire('config');

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

  _getAttackModifier() {
    return utils.gAvg(this.children, 'getAttack', true);
  }

  _updateHpRating(hpCoef) {
    // console.log('++++++++++++++++++++');
    // console.log(this.children);
    let avgOpHealth = this.children.reduce((sum, operator) => {
      // console.log("sum:", sum);
      // console.log('op:', operator)
      return sum + operator.health;
    }, 0);
    // console.log('-------------------');
    // let avgOpHealth = 0;
    // for (const operator of this.children) {
    //   avgOpHealth += operator.health;
    // }
    avgOpHealth /= this.children.length;
    this.rating.hp.val = (this.health + avgOpHealth) * hpCoef;
    this.rating.hp.needsUpdate = false;
    return this.rating.hp.val;
  }


  getDamage(isAttack = true) {
    let sum = 0;
    for (const operator of this.children) {
      sum += operator.xp / 100;
      if (isAttack && operator.xp < 50) {
        operator.xp++;
        this.rating.dmg.needsUpdate = true;
      }
    }
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
      for (const child of this.children) {
        if (child !== chosenChild) {
          child.takeDamage(toOtherChildren / (this.children.length - (initialCount > this.children.length ? 0 : 1))); // making sure dead passenger does not take portion of this damage
        }
      }
    }
    this.rating.hp.needsUpdate = true;
    this.rating.dmg.needsUpdate = true;
  }
}

module.exports = Vehicle;
