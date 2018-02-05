const Squad = rootRequire('Military/Groups/Squad/Squad');
const config = rootRequire('config');
const Group = rootRequire('Military/Groups/Group');

class Army extends Group{

    constructor(nOfSquads = config.squads.default,
                nOfUnits = config.units.default,
                strategy = config.strategy.default,
                parent ){
        super(parent);
        for(let i = 0; i < nOfSquads; i++){
            this.children.push(new Squad(nOfUnits, strategy, this));
        }

    }


}

module.exports = Army;