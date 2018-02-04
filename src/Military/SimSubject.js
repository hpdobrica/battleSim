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
            console.log(`${this.constructor.name} HAS DIED (${this.parent.children.length - 1} more in it's parent ${this.parent.constructor.name})`);
            this.parent.children.splice(index, 1);
            this.parent.isActive();
        }else{
            throw new Error('You are dumping that which is already dumped! Don\'t!' );
        }

    }


}

module.exports = SimSubject;