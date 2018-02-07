const config = rootRequire('config');
const Soldier = rootRequire('Military/Units/Soldier/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle/Vehicle');
const utils = rootRequire('utils/utils');
const Group = rootRequire('Military/Groups/Group');

const has = Object.prototype.hasOwnProperty;

class Squad extends Group {
  constructor(
    nOfUnits = config.units.default,
    strategy = config.strategy.default,
    parent = undefined,
  ) {
    super(parent);
    this.target = null;
    this.maxChildRecharge = null;
    this.intervalId = null;
    this.strategy = strategy;

    const unitsToCreate = this._getUnitRatio(nOfUnits);

    for (let i = 0; i < unitsToCreate.soldiers; i++) {
      this.children.push(new Soldier(this));
    }
    for (let i = 0; i < unitsToCreate.vehicles; i += 1) {
      this.children.push(new Vehicle(this));
    }

    // 1 / biggest possible value, so that each max rating adds up to 1, with the total of 4
    this.coefficients = {
      hp: 1 / (nOfUnits * (config.units.maxHp * 2)),
      xp: 1 / (this.children.length * config.units.soldiers.maxXp),
      n: 1 / nOfUnits,
      dmg: 1 / ((0.1 + ((config.units.soldiers.maxXp / 100) * config.units.vehicles.operators.max)) * nOfUnits),
    };

    this.rating = undefined;
  }

  updateRating() {
    const oldRating = this.rating;
    const tmpRatings = {
      hp: 0, xp: 0, n: 0, dmg: 0,
    };
    this.children.forEach((child) => {
      const childRating = child.getRating(this.coefficients);
      tmpRatings.hp += childRating.hp;
      tmpRatings.dmg += childRating.dmg;
    });
    tmpRatings.xp = (has.call(this.children[0], 'xp') ? this.children[0].xp : this.children[0].children[0].xp) * this.coefficients.xp;
    tmpRatings.n = this.children.length * this.coefficients.n;
    this.rating = tmpRatings.hp + tmpRatings.xp + tmpRatings.n + tmpRatings.dmg;
    if (this.rating > 4 || tmpRatings.hp > 1 || tmpRatings.xp > 1 || tmpRatings.n > 1 || tmpRatings.dmg > 1) {
      throw new Error(`Something went wrong, ratings are limited to 1| Total: ${+this.rating.toFixed(2)}, hp:${+tmpRatings.hp.toFixed(2)} , xp:${+tmpRatings.xp.toFixed(2)} , n:${+tmpRatings.n.toFixed(2)} , dmg:${+tmpRatings.dmg.toFixed(2)} `);
    }
    if (this.strategy !== 'random' && oldRating !== undefined) {
      this.parent.keepChildrenSorted(this, oldRating, this.strategy);
    }
  }


  _getUnitRatio(nOfUnits) {
    const r = utils.rand(0, nOfUnits);
    return {
      soldiers: nOfUnits - r,
      vehicles: r,
    };
  }

  getAttack() {
    return utils.gAvg(this.children, 'getAttack', true);
  }

  getDamage() {
    const total = this.children.reduce((sum, child) => sum + child.getDamage(), 0);
    // let total = 0;
    // for (const child of this.children) {
    //   total += child.getDamage();
    // }
    this.updateRating();
    return total;
  }

  initiateCombat(armies) {
    this.everyone = armies;

    this._getChildRecharge();
    this._setBattleInterval();
  }

  _chooseTarget() {
    this.enemies = this.everyone.slice(0);
    this.enemies.splice(this.enemies.indexOf(this.parent), 1);
    if (this.strategy === 'random') {
      const army = this.enemies[utils.rand(0, this.enemies.length - 1)];
      this.target = army.children[utils.rand(0, army.children.length - 1)];
    } else {
      this.target = this.enemies[0].children[0];
    }
    // console.log(`#${this.parent.getParentIndex()}/${this.getParentIndex()} has chosen #${this.target.parent.getParentIndex()}/${this.target.getParentIndex()} for it's target`)
  }

  _getChildRecharge() {
    // for (const child of this.children) {
    //   if (child.recharge > maxRecharge) {
    //     maxRecharge = child.recharge;
    //   }
    // }
    this.maxChildRecharge = Math.max(...this.children.map(child => child.recharge));

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this._setBattleInterval();
    }
  }

  _attack() {
    if (this.target.parent.children.indexOf(this.target) === -1) {
      this.target = null;
      this._chooseTarget();
    }
    const attackPts = this.getAttack();
    const defensePts = this.target.getAttack();
    if (attackPts > defensePts) {
      const dmg = this.getDamage();
      // console.log(`#${this.parent.parent.children.indexOf(this.parent)}/${this.parent.children.indexOf(this)} > #${this.target.parent.parent.children.indexOf(this.target.parent)}/${this.target.parent.children.indexOf(this.target)} for ${dmg} damage`);
      this.target.takeDamage(dmg);
    }
  }

  _setBattleInterval() {
    this.intervalId = setInterval(() => {
      this._chooseTarget();
      this._attack();
    }, this.maxChildRecharge);
  }

  takeDamage(dmg) {
    const perCapita = dmg / this.children.length;
    this.children.forEach((child) => {
      child.takeDamage(perCapita);
    });
    if (this.children[0]) {
      this.updateRating();
    }
  }

  dump() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    super.dump();
  }

  recalculateCoef() {
    this.coefficients.xp = 1 / (this.children.length * config.units.soldiers.maxXp);
    this.updateRating();
  }
}

module.exports = Squad;
