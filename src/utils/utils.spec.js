const utils = require('./utils');
const chai = require('chai').should();

describe("Utils", () => {
    it('should return a random number', () => {
        let sum = 0;
        const bigNum = 100000;
        for(let i = 0; i<bigNum;i++){
            sum += utils.rand(1,6);
        }
        let mean = sum/bigNum;
        mean.should.be.a('number');
        mean.should.be.below(3.6);
        mean.should.be.above(3.4);

    });
});
