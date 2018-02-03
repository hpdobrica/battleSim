const config = rootRequire('config');
const Soldier = rootRequire('Military/Units/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle');
const utils = rootRequire('utils/utils');

class Squad{
    constructor(nOfUnits = config.units.default,
                strategy = config.strategy.default){

        this.strategy = strategy;
        this.units = [];

        nOfUnits = this._getUnitRatio(nOfUnits);

        for(let i = 0; i < nOfUnits.soldiers; i++){
            this.units.push(new Soldier());
        }
        for(let i = 0; i < nOfUnits.vehicles; i++){
            this.units.push(new Vehicle());
        }
    }

    _getUnitRatio(nOfUnits){
        let r = utils.rand(0,nOfUnits);
        return {
            soldiers: nOfUnits - r,
            vehicles: r
        }
    }
}

module.exports = Squad;