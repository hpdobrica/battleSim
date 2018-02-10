const config = require('../../config');
const Soldier = require('../Units/Soldier');
const Vehicle = require('../Units/Vehicle');
const utils = require('../../utils/utils');
const Group = require('./Group');
const Strategies = require('../Strategies');

const has = Object.prototype.hasOwnProperty;

class Squad extends Group {
  constructor(parent = undefined) {
    super(parent);
    this.target = null;
    this.maxChildRecharge = null;
    this.intervalId = null;

    const nOfUnits = utils.rand(config.units.min, config.units.max);

    const unitsToCreate = Squad.getUnitRatio(nOfUnits);

    for (let i = 0; i < unitsToCreate.soldiers; i += 1) {
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
    if (this.rating > this.parent.max) this.parent.max = this;
    if (this.rating < this.parent.min) this.parent.min = this;
  }


  static getUnitRatio(nOfUnits) {
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
    this.updateRating();
    return total;
  }

  initiateCombat(armies) {
    this.everyone = armies;

    this.getChildRecharge();
    this.setBattleInterval();
  }

  chooseStrategy() {
    const rand = utils.rand(0, Object.keys(Strategies).length - 1);
    const keys = Object.keys(Strategies);
    this.strategy = Strategies[keys[rand]];
  }

  chooseTarget() {
    let stratName;
    this.enemies = this.everyone.slice(0);
    this.enemies.splice(this.enemies.indexOf(this.parent), 1);
    if (this.strategy === Strategies.RANDOM) {
      const targetArmy = this.enemies[utils.rand(0, this.enemies.length - 1)];
      this.target = targetArmy.children[utils.rand(0, targetArmy.children.length - 1)];
      stratName = 'random';
    } else if (this.strategy === Strategies.STRONGEST) {
      this.target = this.enemies.reduce((result, army) => {
        if (army.max.rating > result.max.rating) result = army; // eslint-disable-line no-param-reassign
        return result;
      }, { max: { rating: 0 } }).max;
      stratName = 'strongest';
    } else if (this.strategy === Strategies.WEAKEST) {
      this.target = this.enemies.reduce((result, army) => {
        if (army.min.rating < result.min.rating) result = army; // eslint-disable-line no-param-reassign
        return result;
      }, { min: { rating: Number.MAX_VALUE } }).min;
      stratName = 'weakest';
    } else {
      throw new Error('Strategy not found!');
    }
    console.log(`TARGET (${stratName} strategy): #${this.parent.name}/#${this.getParentIndex()} targets ${this.target.parent.name}/#${this.target.getParentIndex()}`);
  }

  getChildRecharge() {
    this.maxChildRecharge = Math.max(...this.children.map(child => child.recharge));

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.setBattleInterval();
    }
  }

  attack() {
    if (this.target.parent.children.indexOf(this.target) === -1) {
      throw new Error('Targeting a dead squad? Don\'t you have something better to do?');
    }
    const attackPts = this.getAttack();
    const defensePts = this.target.getAttack();
    if (attackPts > defensePts) {
      const dmg = this.getDamage();
      console.log(`ATTACK: ${this.parent.name}/#${this.parent.children.indexOf(this)} inflicts ${+dmg.toFixed(2)} damage to ${this.target.parent.name}/#${this.target.parent.children.indexOf(this.target)}`);
      this.target.takeDamage(dmg);
    } else {
      console.log(`BLOCK: ${this.target.parent.name}'s #${this.target.parent.children.indexOf(this.target)} squad defends the ${this.parent.name} #${this.parent.children.indexOf(this)} squad's attack`);
    }
  }


  setBattleInterval() {
    this.intervalId = setInterval(() => {
      this.chooseStrategy();
      this.chooseTarget();
      this.attack();
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

    if (this.parent.min === this) {
      this.parent.setMin();
    }
    if (this.parent.max === this) {
      this.parent.setMax();
    }
  }

  recalculateCoef() {
    this.coefficients.xp = 1 / (this.children.length * config.units.soldiers.maxXp);
    this.updateRating();
  }
}

module.exports = Squad;
