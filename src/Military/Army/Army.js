const Squad = rootRequire('Military/Squad/Squad');
const config = rootRequire('config');

class Army{
    constructor(nOfSquads = config.squads.default,
                nOfUnits = config.units.default,
                strategy = config.strategy.default){

        this.squads = [];
        for(let i = 0; i < nOfSquads; i++){
            this.squads.push(new Squad(nOfUnits, strategy));
        }

    }
}

module.exports = Army;