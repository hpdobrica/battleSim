const Squad = require('../src/Military/Groups/Squad');

const chai = require('chai').should();

describe('Squad', () => {
  let squad = null;
  const container = {
    children: [],
    isActive() {

    },
  };
  it('should create a squad', () => {
    squad = new Squad(container);
    squad.should.be.instanceOf(Squad);
  });

  it('should check squad\'s attack calculator', () => {
    const dummyObj = {
      children: [
        { getAttack: () => 1 },
        { getAttack: () => 2 },
        { getAttack: () => 3 },
      ],
    };

    const attack = squad.getAttack.apply(dummyObj);
    attack.should.be.a('number');
    attack.should.be.closeTo(1.8171205928321, 0.001);
  });
});
