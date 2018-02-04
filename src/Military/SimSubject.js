class MilitaryUnit{
    constructor(parent){
        if (new.target === MilitaryUnit) {
            throw new TypeError("Cannot construct a MilitaryUnit directly!");
        }
        if (typeof parent === "undefined") {
            throw new TypeError("parent must be passed!");
        }
        this.parent = parent;
    }

    isActive(){
        let stillAlive = false;
        for(let child of this.children){
            if(child.isActive()){
                stillAlive = true;
            }
        }
        if(stillAlive){
            return true;
        }else{
            this.dump();
            return false;
        }
    }


    dump(){

        let index = this.parent.children.indexOf(this);
        if (index > -1) {
            this.parent.children.splice(index, 1);

            this.parent.isActive();
        }
        console.log(`${this.constructor.name} HAS DIED (${this.parent.children.length} more in it's parent ${this.parent.constructor.name})`);
    }


    _overrideRequiredFor(overrider, fnArr){
        for(let fn of fnArr){
            if (typeof overrider[fn] === undefined) {
                throw new TypeError(`${overrider.name} class must override the method ${fn}`);
            }
        }
    }

}

module.exports = MilitaryUnit;