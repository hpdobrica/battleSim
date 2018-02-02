export default {
    armies: {
        min: 2,
        max: Number.MAX_SAFE_INTEGER
    },
    attackStrategies: ['random', 'weakest', 'strongest'],
    squads: {
        minPerArmy: 2,
        maxPerArmy: Number.MAX_SAFE_INTEGER
    },
    units: {
        minPerSquad: 5,
        maxPerSquad: 10,
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
    }

}