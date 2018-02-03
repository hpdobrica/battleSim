const Soldier = rootRequire('Military/Units/Soldier');
const Unit = rootRequire('Military/Units/Unit');

const chai = require('chai').should();

describe("Soldier", () => {
    let soldier = null;
    it('should create an soldier', () => {
        soldier = new Soldier();
        soldier.should.be.instanceOf(Unit);
        soldier.should.be.instanceOf(Soldier);

        // army.squads.length.should.be.equal(5);
        // army.squads[0].should.be.instanceOf(Squad);

    });

    it('should get soldier\'s attack', () => {
        let attack = soldier.getAttack();
        attack.should.be.a('number');

    })
});
