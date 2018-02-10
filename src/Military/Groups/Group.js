const SimSubject = require('../SimSubject');

class Group extends SimSubject {
  constructor(parent) {
    super(parent);
    if (new.target === Group) {
      throw new TypeError('Cannot construct a Group directly!');
    }
    this.children = [];
  }
}

module.exports = Group;
