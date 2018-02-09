const Army = rootRequire('Military/Groups/Army/Army');
const Squad = rootRequire('Military/Groups/Squad/Squad');
const chai = require('chai').should();

describe("Army", () => {
    let army = null;
    let container = {
        children: [],
        isActive(){

        }
    };
    it('should create an army with n squads', () => {

        army = new Army(2,2,'random', container);
        container.children.push(army) ;
        army.should.be.instanceOf(Army);

        army.children.length.should.be.equal(2);
        army.children[0].should.be.instanceOf(Squad);

    });
    it('should initially be active and well', () => {
       army.isActive().should.be.equal(true);
    });
});
