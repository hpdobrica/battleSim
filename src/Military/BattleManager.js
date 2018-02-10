const Army = require('./Groups/Army');
const Group = require('./Groups/Group');
const armyNames = require('./Groups/armyNames');
const utils = require('../utils/utils');

class BattleManager extends Group {
  constructor(nOfArmies) {
    super(null);
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
      this.children.push(new Army(this, `${name} Army${usedNamesIndex > 0 ? ` #${usedNamesIndex + 1}` : ''}`));
    }

    this.startBattle();
  }

  startBattle() {
    // calculate everyone's rating
    this.children.forEach((army) => {
      army.children.forEach((squad) => {
        squad.updateRating();
      });
    });

    this.setMinMax();

    // let the games begin
    this.children.forEach((army) => {
      army.children.forEach((squad) => {
        squad.initiateCombat(this.children);
      });
    });
    this.startLog();
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

  setMinMax() {
    this.children.forEach((army) => {
      army.setMin();
      army.setMax();
    });
  }

  dump() { // eslint-disable-line class-methods-use-this
    throw new Error('Can\'t dump the battle manager!');
  }
  getParentIndex() { // eslint-disable-line class-methods-use-this
    throw new Error('Battle manager has no parent!');
  }

  startLog() {
    console.log(`The battle between ${this.children.length} armies has begun!`);
    console.log('Armies:');
    this.children.forEach((army) => {
      console.log(` - ${army.name}`);
    });
  }
}
module.exports = BattleManager;
