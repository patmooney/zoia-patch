const BYTE_STRIDE = 4;

class ZoiaPatch {
    constructor(data) {
        this.buffer = data;
        this._schema = null;
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
            this._schema = this.buildSchema();
        }
        return this._schema;
    }
    get schema() {
        return this.getSchema();
    }
    getModuleData() {
        const buff = this.buffer;
        const numberOfModules = getNumberAt(buff, 5);
        let currentOff = 6;
        const modBuffs = [];
        for (let i = 0; i < numberOfModules; i++) {
            modBuffs.push(getBufferAt(buff, currentOff, getNumberAt(buff, currentOff)));
            currentOff = currentOff + getNumberAt(buff, currentOff);
        }
        const parseModule = (subBuff) => {
            const getNum = (n) => getNumberAt(subBuff, n);
            const mod = {
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
            };
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
    getType(t) {
        return {
            0: 'SV Filter',
            1: 'Audio Input',
            2: 'Audio Out',
            3: 'Aliaser',
            4: 'Sequencer',
            5: 'LFO',
            6: 'ADSR',
            7: 'VCA',
            8: 'Audio Multiply',
            9: 'Bit Crusher',
            10: 'Sample and Hold',
            11: 'OD & DistorLon',
            12: 'Env Follower',
            13: 'Delay line',
            14: 'Oscillator',
            15: 'Pushbutton',
            16: 'Keyboard',
            17: 'CV Invert',
            18: 'Steps',
            19: 'Slew Limiter',
            20: 'MIDI Notes in',
            21: 'MIDI CC in',
            22: 'MulLplier',
            23: 'Compressor',
            24: 'MulL-filter',
            25: 'Plate Reverb',
            26: 'Buffer delay',
            27: 'All-pass filter',
            28: 'Quantizer',
            29: 'Phaser',
            30: 'Looper',
            31: 'In Switch',
            32: 'Out Switch',
            33: 'Audio In Switch',
            34: 'Audio Out Switch',
            35: 'Midi pressure',
            36: 'Onset Detector',
            37: 'Rhythm',
            38: 'Noise',
            39: 'Random',
            40: 'Gate',
            41: 'Tremolo',
            42: 'Tone Control',
            43: 'Delay w/Mod',
            44: 'Stompswitch',
            45: 'Value',
            46: 'CV Delay',
            47: 'CV Loop',
            48: 'CV Filter',
            49: 'Clock Divider',
            50: 'Comparator',
            51: 'CV Rectify',
            52: 'Trigger',
            53: 'Stereo Spread',
            54: 'Cport Exp/CV in',
            55: 'Cport CV out',
            56: 'UI Button',
            57: 'Audio Panner',
            58: 'Pitch Detector',
            59: 'Pitch Shieer',
            60: 'Midi Note out',
            61: 'Midi CC out',
            62: 'Midi PC out',
            63: 'Bit Modulator',
            64: 'Audio Balance',
            65: 'Inverter',
            66: 'Fuzz',
            67: 'Ghostverb',
            68: 'Cabinet Sim',
            69: 'Flanger',
            70: 'Chorus',
            71: 'Vibrato',
            72: 'Env Filter',
            73: 'Ring Modulator',
            74: 'Hall Reverb',
            75: 'Ping Pong Delay',
            76: 'Audio Mixer',
            77: 'CV Flip Flop',
            78: 'Diffuser',
            79: 'Reverb Lite',
            80: 'Room Reverb',
            81: 'Pixel',
            82: 'Midi Clock In',
            83: 'Granular',
            84: 'Midi Clock Out',
            85: 'Tap to CV',
            86: 'MIDI Pitch Bend In',
            104: 'CV Mixer'
        }[t];
    }
    getColour(c) {
        return {
            0: '?',
            1: 'Blue',
            2: 'Green',
            3: 'Red',
            4: 'Yellow',
            5: 'Aqua',
            6: 'Magenta',
            7: 'White',
            8: 'Orange',
            9: 'Lime',
            10: 'Surf',
            11: 'Sky',
            12: 'Purple',
            13: 'Pink',
            14: 'Peach',
            15: 'Mango',
        }[c];
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
    buff.slice(n * BYTE_STRIDE, (n * BYTE_STRIDE) + (len * BYTE_STRIDE)).toString().replace(/\0/g, '');

const getBufferAt = (buff, n, len = 1) =>
    buff.slice(n * BYTE_STRIDE, (n * BYTE_STRIDE) + (len * BYTE_STRIDE));

module.exports = ZoiaPatch;
