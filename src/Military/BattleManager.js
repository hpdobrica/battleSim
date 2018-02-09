const Army = rootRequire('Military/Groups/Army/Army');
const Group = rootRequire('Military/Groups/Group');
const armyNames = rootRequire('Military/Groups/Army/armyNames');
const utils = rootRequire('utils/utils');

class BattleManager extends Group {
  constructor(nOfArmies) {
    super(null);
    this.strongest = undefined;
    this.weakest = undefined;

    const usedNames = [[]];
    let usedNamesIndex = 0;
    let tmpArmyNames = armyNames.slice(0);
    // create armies
    for (let i = 0; i < nOfArmies; i += 1) {
      if (usedNames[usedNamesIndex].length === armyNames.length) {
        usedNamesIndex += 1;
        tmpArmyNames = armyNames.slice(0);
        usedNames[usedNamesIndex] = [];
      }

      const random = utils.rand(0, tmpArmyNames.length - 1);
      const name = tmpArmyNames[random];
      tmpArmyNames.splice(tmpArmyNames.indexOf(name), 1);

      usedNames[usedNamesIndex].push(name);
      this.children.push(new Army(this, `${name} Army ${usedNamesIndex > 0 ? `#${usedNamesIndex + 1}` : ''}`));
    }
    this.startBattle();
  }

  startBattle() {
    // calculate everyone's rating
    for (const army of this.children) {
      for (const squad of army.children) {
        squad.updateRating();
      }
    }

    [this.weakest, this.strongest] = this.getMinMax();
    console.log(this.weakest.rating, this.strongest.rating);

    // this.maxChildRecharge = Math.max(...this.children.map(child => child.recharge));

    // let the games begin
    this.children.forEach((army) => {
      army.children.forEach((squad) => {
        squad.initiateCombat(this.children);
      });
    });
    this._startLog();
  }

  isActive() {
    if (this.children.length <= 1) {
      console.log("=+=+=+=+=+= IT'S OVER =+=+=+=+=+=");
      if (this.children.length !== 0) {
        console.log(`${this.children[0].name} is victorious!`);
      } else {
        console.log('...but at what cost?');
      }
      process.exit(0);
      return true;
    }
    return true;
  }

  _needsToMove(modifiedChild, direction, index) {
    if (this.children[index + direction]) {
      return direction === -1 && modifiedChild.rating > this.children[index + direction].children[0].rating ||
        direction === 1 && modifiedChild.rating < this.children[index + direction].children[0].rating;
    }
    return false;
  }

  keepChildrenSorted(modifiedChild, oldRating, strategy) {
    modifiedChild.rating = modifiedChild.children[0].rating;
    super.keepChildrenSorted(modifiedChild, oldRating, strategy);
  }

  getMinMax() {
    const initialObj = {
      min: {
        rating: Number.MAX_VALUE,
      },
      max: {
        rating: 0,
      },
    };
    const minMax = this.children.map((army) => {
      // turns every army into min/max squad
      return army.children.reduce((res, squad) => {
        if (squad.rating < res.min.rating) res.min = squad;
        if (squad.rating > res.max.rating) res.max = squad;
        return res;
      }, initialObj);
    }).reduce((res, obj) => {
      if (obj.min.rating < res.min.rating) res.min = obj.min;
      if (obj.max.rating > res.max.rating) res.max = obj.max;
      return res;
    }, initialObj);

    return [minMax.min, minMax.max];
  }

  dump() {
    throw new Error('Can\'t dump the battle manager!');
  }
  getParentIndex() {
    throw new Error('Battle manager has no parent!');
  }

  _startLog() {
    console.log(`The battle between ${this.children.length} armies has begun!`);
    console.log('Armies:');
    this.children.forEach((army) => {
      // console.log(` - ${army.name}`);
    });
    setInterval(() => {
      this.logBattleStatus();
    }, 10000);
  }

  logBattleStatus() {
    console.log('=+=+=+=+=+= Battle Status =+=+=+=+=+=');
    for (const army of this.children) {
      console.log(`${army.name} (${army.children.length} squads)`);
      for (const [index, squad] of army.children.entries()) {
        console.log(`# # Squad ${index + 1} ~Rating:${+squad.rating.toFixed(2)}~ (${squad.children.length} units)`);
        for (const [index, unit] of squad.children.entries()) {
          let details = `health:${+unit.health.toFixed(1)},`;
          if (unit.constructor.name === 'Vehicle') {
            details += ` operators: ${unit.children.length}`;
          } else {
            details += ` experience: ${unit.xp}`;
          }
          console.log(`# # # # ${unit.constructor.name} ${index + 1} (${details})`);
        }
      }
    }
    console.log('=+=+=+=+=+= End of Battle Status =+=+=+=+=+=');
  }
}
module.exports = BattleManager;
