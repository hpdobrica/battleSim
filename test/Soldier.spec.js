const Soldier = require('../src/Military/Units/Soldier');
const Unit = require('../src/Military/Units/Unit');

const chai = require('chai').should();

describe('Soldier', () => {
  let soldier = null;
  const container = {
    children: [],
    isActive() {

    },
  };
  it('should create a soldier', () => {
    soldier = new Soldier(container);
    soldier.should.be.instanceOf(Unit);
    soldier.should.be.instanceOf(Soldier);
  });

  it('should get soldier\'s attack', () => {
    const attack = soldier.getAttack();
    attack.should.be.a('number');
  });
});
