const Group = require('./Group');
const Squad = require('./Squad');
const config = require('../../config');
const utils = require('../../utils/utils');

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
      if (squad.rating < res.rating) res = squad; // eslint-disable-line no-param-reassign
      return res;
    }, {
      rating: Number.MAX_VALUE,
    });
  }

  setMax() {
    this.max = this.children.reduce((res, squad) => {
      if (squad.rating > res.rating) res = squad; // eslint-disable-line no-param-reassign
      return res;
    }, {
      rating: 0,
    });
  }
}

module.exports = Army;
