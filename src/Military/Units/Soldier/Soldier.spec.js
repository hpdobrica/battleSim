const Soldier = rootRequire('Military/Units/Soldier');
const Unit = rootRequire('Military/Units/Unit');

const chai = require('chai').should();

describe("Soldier", () => {
    let soldier = null;
    let container = {
        children: [],
        isActive(){

        }
    };
    it('should create a soldier', () => {

        soldier = new Soldier(container);
        soldier.should.be.instanceOf(Unit);
        soldier.should.be.instanceOf(Soldier);


    });

    it('should get soldier\'s attack', () => {
        let attack = soldier.getAttack();
        attack.should.be.a('number');

    })
});
