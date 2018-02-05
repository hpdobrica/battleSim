const Squad = rootRequire('Military/Squad/Squad');
const Soldier = rootRequire('Military/Units/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle');
const Unit = rootRequire('Military/Units/Unit');

const chai = require('chai').should();

describe("Squad", () => {
    let squad = null;
    let container = {
        children: [],
        isActive(){

        }
    };
    it('should create a squad', () => {
        squad = new Squad(3,"random",container);
        squad.should.be.instanceOf(Squad);

        squad.children.should.have.lengthOf(3);
        squad.strategy.should.be.equal("random");

    });

    it('should check squad\'s attack calculator', () => {
        let dummyObj = {
            children: [
                {getAttack: () => 1},
                {getAttack: () => 2},
                {getAttack: () => 3},
            ]
        }

        let attack = squad.getAttack.apply(dummyObj);
        attack.should.be.a('number');
        attack.should.be.closeTo(1.8171205928321, 0.001);


    })


});
