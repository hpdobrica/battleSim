const config = rootRequire('config');
const Soldier = rootRequire('Military/Units/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle');
const utils = rootRequire('utils/utils');
const MilitaryUnit = rootRequire('Military/MilitaryUnit');

class Squad extends MilitaryUnit{
    constructor(nOfUnits = config.units.default,
                strategy = config.strategy.default,
                parent = undefined){
        super(parent);
        this.target = null;
        this.recharge = null;
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
            total += child.getAttack();
        }
        return total;
    }

    initiateCombat(armies){
        armies = armies.slice(0);
        //filter out allied army
        armies.splice(armies.indexOf(this.parent),1);
        //choose a target
        this._chooseTarget(armies);
        //start attacking
        let recharge = this._getRecharge();
        this.intervalId = setInterval(() => {
            this._attack();
        }, recharge);

        //continue to do so until alive
    }

    _chooseTarget(armies){

        // if(this.strategy === "random"){
            let army = armies[utils.rand(0, armies.length-1)];
            console.log(armies);
            this.target = army.children[utils.rand(0,army.children.length)]
        // }
    }

    _getRecharge(){
        //razmisli kad zoves get recharge (kad umre child sa maxRecharge???)
        let maxRecharge = 0;
        for(let child of this.children){
            if(child.recharge > maxRecharge){
                maxRecharge = child.recharge;
            }
        }
        return maxRecharge;

    }

    _attack(){
        let attackPts = this.getAttack();
        let defensePts = this.target.getAttack();
        if(attackPts > defensePts){
            let dmg = this.getDamage();
            this.target.takeDamage(dmg);
        }

    }

    takeDamage(dmg){
        let perCapita = dmg / this.children.length;
        for(let child of this.children){
            child.takeDamage(perCapita);
        }
    }


}

module.exports = Squad;