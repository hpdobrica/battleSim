//allowing mocha to use root require
global.rootRequire = function(name) {
    return require(__dirname + '/src/' + name);
};