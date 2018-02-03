const Army = require('./Army');
const Squad = require('../Squad/Squad');
const chai = require('chai').should();

describe("Army", () => {
    it('should create an army with n squads', () => {
        let army = new Army(5);
        army.should.be.instanceOf(Army);

        army.squads.length.should.be.equal(5);
        army.squads[0].should.be.instanceOf(Squad);

    });
});
