const config = rootRequire('config');
const Soldier = rootRequire('Military/Units/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle');
const utils = rootRequire('utils/utils');
const SimSubject = rootRequire('Military/SimSubject');

class Squad extends SimSubject{
    constructor(nOfUnits = config.units.default,
                strategy = config.strategy.default,
                parent = undefined){
        super(parent);
        this.target = null;
        this.maxChildRecharge = null;
        this.intervalId = null;
        this.strategy = strategy;
        this.children = [];

        nOfUnits = this._getUnitRatio(nOfUnits);

        for(let i = 0; i < nOfUnits.soldiers; i++){
            this.children.push(new Soldier(this));
        }
        for(let i = 0; i < nOfUnits.vehicles; i++){
            this.children.push(new Vehicle(this));
        }
    }

    _getUnitRatio(nOfUnits){
        let r = utils.rand(0,nOfUnits);
        return {
            soldiers: nOfUnits - r,
            vehicles: r
        }
    }

    getAttack(){
        return utils.gAvg(this.children, "getAttack", true);
    }

    getDamage(){
        let total = 0;
        for(let child of this.children){
            total += child.getDamage();
        }
        return total;
    }

    initiateCombat(armies){
        this.everyone = armies;
        
        this._getChildRecharge();
        this._setBattleInterval();

    }

    _chooseTarget(){
        this.enemies = this.everyone.slice(0);
        this.enemies.splice(this.enemies.indexOf(this.parent),1);
        // if(this.strategy === "random"){
            let army = this.enemies[utils.rand(0, this.enemies.length-1)];
            this.target = army.children[utils.rand(0,army.children.length-1)];
            // console.log(`#${this.parent.getParentIndex()}/${this.getParentIndex()} has chosen #${this.target.parent.getParentIndex()}/${this.target.getParentIndex()} for it's target`)
        // }
    }

    _getChildRecharge(){
        let maxRecharge = 0;
        for(let child of this.children){
            if(child.recharge > maxRecharge){
                maxRecharge = child.recharge;
            }
        }
        this.maxChildRecharge = maxRecharge;

        if(this.intervalId){
            clearInterval(this.intervalId);
            this.intervalId = null;
            this._setBattleInterval();
        }

    }

    _attack(){
        if(this.target.parent.children.indexOf(this.target) === -1){
            this.target = null;
            this._chooseTarget();
        }
        let attackPts = this.getAttack();
        let defensePts = this.target.getAttack();
        if(attackPts > defensePts){
            let dmg = this.getDamage();
            // console.log(`#${this.parent.parent.children.indexOf(this.parent)}/${this.parent.children.indexOf(this)} > #${this.target.parent.parent.children.indexOf(this.target.parent)}/${this.target.parent.children.indexOf(this.target)} for ${dmg} damage`);
            this.target.takeDamage(dmg);
        }
    }

    _setBattleInterval(){
        this.intervalId = setInterval(() => {
            this._chooseTarget();
            this._attack();
        }, this.maxChildRecharge);
    }

    takeDamage(dmg){
        let perCapita = dmg / this.children.length;
        for(let child of this.children){
            child.takeDamage(perCapita);
        }
    }

    dump(){
        if(this.intervalId){
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        super.dump()
    }


}

module.exports = Squad;