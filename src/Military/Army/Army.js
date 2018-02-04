const Squad = rootRequire('Military/Squad/Squad');
const config = rootRequire('config');
const SimSubject = rootRequire('Military/SimSubject');


class Army extends SimSubject{

    constructor(nOfSquads = config.squads.default,
                nOfUnits = config.units.default,
                strategy = config.strategy.default,
                parent ){
        super(parent);
        this.children = [];
        for(let i = 0; i < nOfSquads; i++){
            this.children.push(new Squad(nOfUnits, strategy, this));
        }

    }


}

module.exports = Army;