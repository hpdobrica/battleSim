const Soldier = rootRequire('Military/Units/Soldier/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle/Vehicle');
const Unit = rootRequire('Military/Units/Unit');

const chai = require('chai').should();

describe("Vehicle", () => {
    let vehicle = null;
    let container = {
        children: [],
        isActive(){

        }
    };
    it('should create a vehicle', () => {
        vehicle = new Vehicle(container);
        vehicle.should.be.instanceOf(Unit);
        vehicle.should.be.instanceOf(Vehicle);

        vehicle.children.should.have.lengthOf.at.least(1);
        vehicle.children[0].should.be.instanceOf(Soldier);

    });

    it('should get vehicle\'s attack', () => {
        let attack = vehicle.getAttack();
        attack.should.be.a('number');


    })

    it('should check vehicle\'s attack modifier calculator', () => {
        let dummyObj = {
            children: [
                {getAttack: () => 1},
                {getAttack: () => 2},
                {getAttack: () => 3},
            ]
        }

        let attackModifier = vehicle._getAttackModifier.apply(dummyObj);
        attackModifier.should.be.a('number');
        attackModifier.should.be.closeTo(1.8171205928321, 0.001);


    })
});
