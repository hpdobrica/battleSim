const config = rootRequire('config');

class Squad{
    constructor(nOfUnits = config.units.default,
                strategy = config.strategy.default){
        this.strategy = strategy;
        this.units = [];
        for(let i = 0; i < nOfUnits; i++){

            // this.units.push(new Unit());
        }
    }
}

module.exports = Squad;