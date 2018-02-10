const Soldier = require('../src/Military/Units/Soldier');
const Vehicle = require('../src/Military/Units/Vehicle');
const Unit = require('../src/Military/Units/Unit');

const chai = require('chai').should();

describe('Vehicle', () => {
  let vehicle = null;
  const container = {
    children: [],
    isActive() {

    },
  };
  it('should create a vehicle', () => {
    vehicle = new Vehicle(container);
    vehicle.should.be.instanceOf(Unit);
    vehicle.should.be.instanceOf(Vehicle);

    vehicle.children.should.have.lengthOf.at.least(1);
    vehicle.children[0].should.be.instanceOf(Soldier);
  });

  it('should get vehicle\'s attack', () => {
    const attack = vehicle.getAttack();
    attack.should.be.a('number');
  });

  it('should check vehicle\'s damage', () => {
    let damage = vehicle.getDamage();

    damage.should.be.a('number');
    damage.should.be.equal(0.1);

    damage = vehicle.getDamage();
    damage.should.be.equal((vehicle.children.length / 100) + 0.1);
  });

  it('should check vehicle\'s attack modifier calculator', () => {
    const dummyObj = {
      children: [
        { getAttack: () => 1 },
        { getAttack: () => 2 },
        { getAttack: () => 3 },
      ],
    };

    const attackModifier = vehicle.getAttackModifier.apply(dummyObj);
    attackModifier.should.be.a('number');
    attackModifier.should.be.closeTo(1.8171205928321, 0.001);
  });
});
