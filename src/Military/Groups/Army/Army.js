const Squad = rootRequire('Military/Groups/Squad/Squad');
const config = rootRequire('config');
const Group = rootRequire('Military/Groups/Group');

class Army extends Group {
  constructor(
    nOfSquads = config.squads.default,
    nOfUnits = config.units.default,
    strategy = config.strategy.default,
    parent, name,
  ) {
    super(parent);
    this.name = name;
    for (let i = 0; i < nOfSquads; i += 1) {
      this.children.push(new Squad(nOfUnits, strategy, this));
    }
  }
}

module.exports = Army;
