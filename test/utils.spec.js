const utils = require('../src/utils/utils');
const chai = require('chai').should();

describe('Utils', () => {
  it('should return a random number with accurate mean', () => {
    let sum = 0;
    const bigNum = 100000;
    for (let i = 0; i < bigNum; i++) {
      sum += utils.rand(1, 6);
    }
    const mean = sum / bigNum;
    mean.should.be.a('number');
    mean.should.be.closeTo(3.5, 0.1);
  });
});
