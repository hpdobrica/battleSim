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

    keepArmySorted(modifiedSquad, oldRating, strategy){
        if(modifiedSquad.rating === oldRating){
            return true;
        }

        let index = this.children.indexOf(modifiedSquad);
        //should it move forward or backwards
        let direction;
        if(strategy === "strongest"){
            direction = (modifiedSquad.rating > oldRating? -1 : 1);
        }else{
            direction = (modifiedSquad.rating < oldRating? -1 : 1);
        }

        //if it's on edge its done
        if( (direction === -1 && index === 0) || (direction === 1 && index === this.children.length-1) ){
            if(direction === -1 && index === 0){
                this.parent.keepBattlefieldSorted(strategy);
            }
            return true;
        }

        //check if it's in the right spot
        if(direction === -1 && modifiedSquad.rating > this.children[index + direction].rating ||
           direction ===  1 && modifiedSquad.rating < this.children[index + direction].rating){

            this._switchSquads(modifiedSquad, this.children[index + direction]);
            //if first or last element got changed
            if(index === 0 || index === this.children.length-1 || index + direction === 0 || index + direction === this.children.length-1){
                this.parent.keepBattlefieldSorted(strategy);
            }

            this.keepArmySorted(modifiedSquad, oldRating, strategy);

            //test
            let max = 0 ;
            for(let squad of this.children){
                if(squad.rating > max){
                    max = squad.rating;
                }
            }
            if(max  !== this.children[0].rating){
                console.log("about to throw! - ARMY:squad not sorted");
                // throw new Error('Nije dobro sortiran squad?');
            }
            max = 0;
            for(let army of this.parent.children){
                if(army.children[0].rating > max){
                    max = army.children[0].rating;
                }
            }
            if(max !== this.parent.children[0].children[0].rating){
                console.log("about to throw! - ARMY: army not sorted");
                // throw new Error('Nije dobro sortirana armija?');
            }

            return true;
        }else{
            //if it is it's done
            return true;
        }

    }

    _switchSquads(a,b){
        let tmp = a;
        let aIndex = this.children.indexOf(a);
        let bIndex = this.children.indexOf(b);
        this.children[aIndex] = b;
        this.children[bIndex] = tmp;

    }


}

module.exports = Army;