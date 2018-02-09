const Squad = rootRequire('Military/Groups/Squad/Squad');
const config = rootRequire('config');
const Group = rootRequire('Military/Groups/Group');
const utils = rootRequire('utils/utils');

class Army extends Group {
  constructor(parent, name) {
    super(parent);
    this.name = name;
    this.min = undefined;
    this.max = undefined;
    const nOfSquads = utils.rand(config.squads.min, config.squads.max);
    for (let i = 0; i < nOfSquads; i += 1) {
      this.children.push(new Squad(this));
    }
  }

  setMin() {
    this.min = this.children.reduce((res, squad) => {
      if (squad.rating < res.rating) res = squad;
      return res;
    }, {
      rating: Number.MAX_VALUE,
    });
  }

  setMax() {
    this.max = this.children.reduce((res, squad) => {
      if (squad.rating > res.rating) res = squad;
      return res;
    }, {
      rating: 0,
    });
  }
}

module.exports = Army;
