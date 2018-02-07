class SimSubject {
  constructor(parent) {
    if (new.target === SimSubject) {
      throw new TypeError('Cannot construct a MilitaryUnit directly!');
    }
    if (typeof parent === 'undefined') {
      throw new TypeError('parent must be passed!');
    }
    this.parent = parent;
  }

  getParentIndex() {
    return this.parent.children.indexOf(this);
  }

  isActive() {
    if (this.children.some(child => child.isActive())) {
      return true;
    }
    this.dump();
    return false;
  }


  dump() {
    const index = this.getParentIndex();
    if (index > -1) {
      this.logDeath();
      this.parent.children.splice(index, 1);
      this.parent.isActive();
    } else {
      throw new Error('You are dumping that which is already dumped! Don\'t!');
    }
  }

  logDeath() {
    if (this.constructor.name === 'Army') {
      console.log(`${this.name} army has been annihilated!`);
    } else if (this.constructor.name === 'Squad') {
      console.log(`A squad from ${this.parent.name} army has been annihilated! (${this.parent.children.length - 1} more of it's squads are still alive!)`);
    } else if (this.constructor.name === 'Soldier' || this.constructor.name === 'Vehicle') {
      const armyName = this.parent.parent.name ?
        this.parent.parent.name : this.parent.parent.parent.name;
      console.log(`A ${this.constructor.name} from ${armyName} has died. (${this.parent.children.length - 1} more in it's parent ${this.parent.constructor.name})`);
    }
  }
}

module.exports = SimSubject;
