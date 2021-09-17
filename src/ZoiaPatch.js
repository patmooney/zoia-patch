const patchTaxonomy = require('../taxonomy/patch.json');
const modules = require('./modules');
const BYTE_STRIDE = 4;

/**
 * Parses the binary patch files for zoia and returns the structure as an object
 * Used https://github.com/meanmedianmoge/zoia_lib/blob/master/documentation/Binary%20Format.pdf as inspiration
 *
 * @example
 *   const buffer = fs.readFileSync('./my-patch.bin');
 *   const patch = new ZoiaPatch(buffer);
 *   const structure = patch.schema;
 */
class ZoiaPatch {
    constructor(data) {
        this.buffer = data;
        this._schema = null;
    }

    get schema() {
        return this.getSchema();
    }
    buildSchema() {
        const moduleData = this.getModuleData();
        const connectionData = this.getConnectionData(moduleData.offsetEnd);
        const pageData = this.getPageData(connectionData.offsetEnd);

        return {
            name: getStringAt(this.buffer, 1, 4),
            modules: moduleData,
            connections: connectionData,
            pages: pageData
        };
    }
    getSchema() {
        if (!this._schema) {
            try {
                this._schema = this.buildSchema();
            } catch (err) {
                console.error(err);
                throw new Error('Invalid patch file');
            }
        }
        return this._schema;
    }
    getModuleData() {
        const buff = this.buffer;
        // Protect against random files giving horrendous numbers
        const numberOfModules = Math.min(getNumberAt(buff, 5), 250);
        let currentOff = 6;
        const modBuffs = [];
        for (let i = 0; i < numberOfModules; i++) {
            modBuffs.push(getBufferAt(buff, currentOff, getNumberAt(buff, currentOff)));
            currentOff = currentOff + getNumberAt(buff, currentOff);
        }
        const parseModule = (subBuff) => {
            const getNum = (n) => getNumberAt(subBuff, n);
            const mod = {
                meta: {
                    len: getNum(0),
                    type: getNum(1),
                    typeName: this.getType(getNum(1)),
                    unknown: getNum(2),
                    pageNumber: getNum(3),
                    colour: getNum(4),
                    colourName: this.getColour(getNum(4)),
                    gridPosition: getNum(5),
                    numberOfParams: getNum(6),
                    modVersion: getNum(7),
                    options: getBufferAt(subBuff, 8, 2).toString('hex').match(/.{2}/g).map(h => parseInt(h, 16)),
                    params: (new Array(getNum(6)).fill(null).map((_, i) => getNum(10 + i))),
                    name: getStringAt(subBuff, 10+getNum(6), 4)
                }
            };
            mod.display = this.buildModDisplay(mod.meta);
            return mod;
        };
        return { data: modBuffs.map(parseModule), count: numberOfModules, offsetEnd: currentOff };
    }
    getConnectionData(offset) {
        const buff = this.buffer;
        const numberOfConnections = getNumberAt(buff, offset);
        const cxnBuffs = [];
        for (let i = 0; i < numberOfConnections; i++) {
            cxnBuffs.push(getBufferAt(buff, offset + 1 + (i * 5), 5));
        }
        const parseConnection = (subBuff) => ({
            sourceModule: getNumberAt(subBuff, 0),
            sourceOutput: getNumberAt(subBuff, 1),
            destinationModule: getNumberAt(subBuff, 2),
            destinationInput: getNumberAt(subBuff, 3),
            signalStrength: getNumberAt(subBuff, 4)
        });
        return { data: cxnBuffs.map(parseConnection), count: numberOfConnections, offsetEnd: offset + 1 + (numberOfConnections * 5) };
    }
    getPageData(offset) {
        const buff = this.buffer;
        const numberOfPages = getNumberAt(buff, offset);
        const data = [];
        for (let i = 0; i < numberOfPages; i++) {
            data.push({
                name: getStringAt(buff, offset + 1 + (i * 4), 4)
            });
        }
        return { data, count: numberOfPages, offsetEnd: offset + 1 + (numberOfPages * 4) };
    }
    getType(typeId) {
        return patchTaxonomy.moduleTypes[`${typeId}`];
    }
    getColour(colourId) {
        return patchTaxonomy.moduleColours[`${colourId}`];
    }
    buildModDisplay(meta) {
        const module = modules[meta.typeName.toLowerCase().replace(/\s/g, '_')];
        if (!module) {
            return { niceName: meta.typeName || meta.type, buttons: [{ label: 'UNKNOWN MODULE' }] };
        }
        const display = {
            niceName: module.niceName
        };
        if (!module.buttonLogic) {
            return { ...display, buttons: module.buttons };
        }
        return {
            ...display,
            buttons: module.buttonLogic(module, meta.options)
        };
    }
}

// reverse for the big/small endian situation
const getNumberAt = (buff, n, len = 1) => parseInt(
    Buffer.from(
        buff.slice(n * BYTE_STRIDE, (n * BYTE_STRIDE) + (len * BYTE_STRIDE))
    ).reverse().toString('hex'),
    16
);

// remove null chars
const getStringAt = (buff, n, len = 1) =>
    buff.slice(n * BYTE_STRIDE, (n * BYTE_STRIDE) + (len * BYTE_STRIDE)).toString().replace(/[^a-zA-Z0-9\s\-\_]/g, "");

const getBufferAt = (buff, n, len = 1) =>
    buff.slice(n * BYTE_STRIDE, (n * BYTE_STRIDE) + (len * BYTE_STRIDE));

module.exports = ZoiaPatch;
