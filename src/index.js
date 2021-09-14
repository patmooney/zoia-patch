const fs = require('fs');
const ZoiaPatch = require('./ZoiaPatch');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

module.exports = {
    ZoiaPatch,
    fromFile: (fn) => readFile(fn).then(buff => new ZoiaPatch(buff))
};
