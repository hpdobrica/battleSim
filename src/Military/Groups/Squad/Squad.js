const config = rootRequire('config');
const Soldier = rootRequire('Military/Units/Soldier/Soldier');
const Vehicle = rootRequire('Military/Units/Vehicle/Vehicle');
const utils = rootRequire('utils/utils');
const Group = rootRequire('Military/Groups/Group');

class Squad extends Group{
    constructor(nOfUnits = config.units.default,
                strategy = config.strategy.default,
                parent = undefined){
        super(parent);
        this.target = null;
        this.maxChildRecharge = null;
        this.intervalId = null;
        this.strategy = strategy;

        let unitsToCreate = this._getUnitRatio(nOfUnits);

        for(let i = 0; i < unitsToCreate.soldiers; i++){
            this.children.push(new Soldier(this));
        }
        for(let i = 0; i < unitsToCreate.vehicles; i++){
            this.children.push(new Vehicle(this));
        }

        // 1 / biggest possible value, so that each max rating adds up to 1, with the total of 4
        this.coefficients = {
            hp: 1 / (nOfUnits * (config.units.maxHp * 2)),
            xp: 1 / (this.children.length * config.units.soldiers.maxXp),
            n: 1 / nOfUnits,
            dmg: 1 /  ( (0.1 + (config.units.soldiers.maxXp / 100) * config.units.vehicles.operators.max) * nOfUnits )// highest damage possible in simulation
        };

        this.rating = undefined;
    }

    updateRating(){
        let oldRating = this.rating;
        let tmpRatings = { hp: 0, xp: 0, n: 0, dmg: 0 };
        for(let child of this.children){
            let childRating = child.getRating(this.coefficients);
            tmpRatings.hp += childRating.hp;
            tmpRatings.dmg += childRating.dmg;

        }
        tmpRatings.xp = (this.children[0].hasOwnProperty('xp') ? this.children[0].xp : this.children[0].children[0].xp) * this.coefficients.xp;
        tmpRatings.n = this.children.length * this.coefficients.n;

        this.rating = tmpRatings.hp + tmpRatings.xp + tmpRatings.n + tmpRatings.dmg;
        if(this.rating > 4 || tmpRatings.hp > 1 || tmpRatings.xp > 1 || tmpRatings.n > 1 || tmpRatings.dmg > 1){
            throw new Error(`Something went wrong, ratings are limited to 1| Total: ${+this.rating.toFixed(2)}, hp:${+tmpRatings.hp.toFixed(2)} , xp:${+tmpRatings.xp.toFixed(2)} , n:${+tmpRatings.n.toFixed(2)} , dmg:${+tmpRatings.dmg.toFixed(2)} `)
        }
        if(this.strategy !== "random" && oldRating !== undefined){
            this.parent.keepChildrenSorted(this, oldRating, this.strategy);
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
        this.updateRating();
        return total;
    }

    initiateCombat(armies){
        this.everyone = armies;

        this._getChildRecharge();
        this._setBattleInterval();

    }

    _chooseTarget(){
        //test
        let max = 0 ;
        for(let squad of this.parent.children){
            if(squad.rating > max){
                max = squad.rating;
            }
        }
        if(max  !== this.parent.children[0].rating){
            console.log("SQUAD: Squad not sorted");
            throw new Error('Nije dobro sortiran squad?');
        }
        max = 0;
        for(let army of this.parent.parent.children){
            if(army.children[0].rating > max){
                max = army.children[0].rating;
            }
        }
        if(max !== this.parent.parent.children[0].children[0].rating){
            console.log("SQUAD: ARMY not sorted");
            throw new Error('Nije dobro sortirana armija?');
        }
        //test

        this.enemies = this.everyone.slice(0);
        this.enemies.splice(this.enemies.indexOf(this.parent),1);
        // if(this.strategy === "random"){
            let army = this.enemies[utils.rand(0, this.enemies.length-1)];
            this.target = army.children[utils.rand(0,army.children.length-1)];
        // }else if(this.strategy === "strongest"){
            // for(let enemyArmy of this.enemies){
            //
            // }
            // let maxRating = Math.max.apply(Math, this.enemies.map((army) => {
            //     army.children.map((squad) => {
            //         return squad.rating;
            //     })
            // }));
            // this.target = this.enemies.find((army) => {
            //     return army.children.find((squad) => {
            //         return squad.rating === maxRating;
            //     })
            // });
            // console.log(this.target);

        // }else if(this.strategy === "weakest"){

        // }else{
        //     throw new Error("This attack strategy is not implemented!");
        // }

        // console.log(`#${this.parent.getParentIndex()}/${this.getParentIndex()} has chosen #${this.target.parent.getParentIndex()}/${this.target.getParentIndex()} for it's target`)
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
        if(this.children[0]){
            this.updateRating();
        }

    }

    dump(){
        if(this.intervalId){
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        super.dump()
    }

    recalculateCoef(){
        this.coefficients.xp = 1 / (this.children.length * config.units.soldiers.maxXp);
        this.updateRating();
    }


}

module.exports = Squad;