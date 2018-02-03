class Army{
    constructor(nOfSquads, nOfUnits, strategy){
        this.squads = [];
        for(let i = 0; i < nOfSquads; i++){
            this.squads.push(new Army(nOfUnits, strategy));
        }
    }
}

module.exports = Army;