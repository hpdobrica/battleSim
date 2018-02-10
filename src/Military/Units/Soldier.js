const Unit = require('./Unit');
const utils = require('../../utils/utils');

class Soldier extends Unit {
  constructor(parent) {
    super(parent);
    this.xp = 0;
  }

  getAttackModifier() {
    return utils.rand(30 + this.xp, 100) / 100;
  }


  getDamage(isAttack = true) {
    const dmg = 0.05 + (this.xp / 100);
    if (isAttack && this.xp < 50) {
      this.xp += 1;
      this.rating.dmg.needsUpdate = true;
    }
    return dmg;
  }

  isActive() {
    if (this.health <= 0) {
      this.dump();
      return false;
    }
    return true;
  }

  takeDamage(dmg) {
    this.health -= dmg;
    if (this.health <= 0) {
      this.dump();
    }
    this.rating.hp.needsUpdate = true;
    this.rating.dmg.needsUpdate = true;
  }
}

module.exports = Soldier;
