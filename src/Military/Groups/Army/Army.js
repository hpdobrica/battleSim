const Squad = rootRequire('Military/Groups/Squad/Squad');
const config = rootRequire('config');
const Group = rootRequire('Military/Groups/Group');
const utils = rootRequire('utils/utils');

class Army extends Group {
  constructor(parent, name) {
    super(parent);
    this.name = name;
    const nOfSquads = utils.rand(config.squads.min, config.squads.max);
    for (let i = 0; i < nOfSquads; i += 1) {
      this.children.push(new Squad(this));
    }
  }
}

module.exports = Army;
