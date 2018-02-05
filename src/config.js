let config = {
    armies: {
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    squads: {
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    units:{
        min: 5,
        max: 10,
        maxHp: 100,
        recharge: {
            min: 100,
            max: 2000
        },
        soldiers: {
            defaultXp: 0,
            maxXp: 50,

        },
        vehicles: {
            operators: {
                min: 1,
                max: 3
            },
            recharge: {
                min: 1000
            }
        }

    },
    strategy: {
        choices: ['random', 'weakest', 'strongest']
    }


};

module.exports = config;