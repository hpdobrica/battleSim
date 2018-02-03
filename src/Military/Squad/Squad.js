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
        //filter out allied army
        this.everyone = armies;
        //choose a target
        this._chooseTarget();
        //start attacking
        let recharge = this._getRecharge();
        this.intervalId = setInterval(() => {
            this._attack();
        }, recharge);

        //continue to do so until alive
    }

    _chooseTarget(){
        this.enemies = this.everyone.slice(0);
        this.enemies.splice(this.enemies.indexOf(this.parent),1);
        // if(this.strategy === "random"){
            let army = this.enemies[utils.rand(0, this.enemies.length-1)];
            this.target = army.children[utils.rand(0,army.children.length-1)];
            console.log(`${this.parent.parent.children.indexOf(this.parent)}/${this.parent.children.indexOf(this)} has chosen #${this.target.parent.parent.children.indexOf(this.target.parent)}/${this.target.parent.children.indexOf(this.target)} for it's target`)
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
        if(this.target.health <= 0){
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

    takeDamage(dmg){
        let perCapita = dmg / this.children.length;
        for(let child of this.children){
            child.takeDamage(perCapita);
        }
    }


}

module.exports = Squad;