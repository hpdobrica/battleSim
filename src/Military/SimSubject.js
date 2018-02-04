class SimSubject{
    constructor(parent){
        if (new.target === SimSubject) {
            throw new TypeError("Cannot construct a MilitaryUnit directly!");
        }
        if (typeof parent === "undefined") {
            throw new TypeError("parent must be passed!");
        }
        this.parent = parent;
    }

    getParentIndex(){
        return this.parent.children.indexOf(this);
    }

    isActive(){
        for(let child of this.children){
            if(child.isActive()){
                return true;
            }
        }
        this.dump();
        return false;

    }


    dump(){
        let index = this.getParentIndex();
        if (index > -1) {
            console.log(`${this.constructor.name} HAS DIED (${this.parent.children.length} more in it's parent ${this.parent.constructor.name})`);
            this.parent.children.splice(index, 1);
            this.parent.isActive();
        }else{
            throw new Error('You are dumping that which is already dumped! Don\'t!' );
        }

    }


    _overrideRequiredFor(overrider, fnArr){
        for(let fn of fnArr){
            if (typeof overrider[fn] === undefined) {
                throw new TypeError(`${overrider.name} class must override the method ${fn}`);
            }
        }
    }

}

module.exports = SimSubject;