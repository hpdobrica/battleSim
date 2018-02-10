module.exports = class Helpers {
  static rand(minArg, maxArg) {
    const min = Math.ceil(minArg);
    const max = Math.floor(maxArg);
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  }

  static gAvg(group, property, isFn = false) {
    let product = 1;
    group.forEach((child) => {
      if (isFn) {
        product *= child[property]();
      } else {
        product *= child[property];
      }
    });
    return product ** (1 / group.length);
  }
};
