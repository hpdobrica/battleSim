const config = {
  armies: {
    min: 2,
    max: 1000,
  },
  squads: {
    min: 2,
    max: 100,
  },
  units: {
    min: 5,
    max: 10,
    maxHp: 100,
    recharge: {
      min: 100,
      max: 2000,
    },
    soldiers: {
      defaultXp: 0,
      maxXp: 50,

    },
    vehicles: {
      operators: {
        min: 1,
        max: 3,
      },
      recharge: {
        min: 1000,
      },
    },

  },
  strategy: {
    choices: ['random', 'weakest', 'strongest'],
  },


};

module.exports = config;
