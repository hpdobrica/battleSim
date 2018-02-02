module.exports = {
    armies: {
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    squads: {
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    units: {
        min: 5,
        max: 10,
        defaultHp: 100,
        soldiers: {
            defaultXp: 0,
            maxXp: 50,
            recharge: {
                min: 100,
                max: 2000
            },
        },
        vehicles: {
            operators: {
                min: 1,
                max: 3
            },
            recharge: {
                min: 1000,
                max: 2000
            },
        }
    },
    attackStrategies: ['random', 'weakest', 'strongest'],

}