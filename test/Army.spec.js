const Army = require('../src/Military/Groups/Army');
const Squad = require('../src/Military/Groups/Squad');
const chai = require('chai').should();

describe('Army', () => {
  let army = null;
  const container = {
    children: [],
    isActive() {

    },
  };
  it('should create an army with n squads', () => {
    army = new Army(container, 'Name');
    container.children.push(army);
    army.should.be.instanceOf(Army);
    army.children[0].should.be.instanceOf(Squad);
  });
  it('should initially be active and well', () => {
    army.isActive().should.be.equal(true);
  });
});
