module.exports = class Helpers{
    static rand(min,max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static gAvg(group, property, isFn = false){
        let product = 1;
        for(let member of group){
            if(isFn){
                product *= member[property]();
            }else{
                product *= member[property];
            }

        }
        return Math.pow(product, 1/group.length);
    }

};