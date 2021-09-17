const assert = require('assert');
const fs = require('fs');

describe('Schema', () => {
    it('can parse a schema', async () => {
        const { ZoiaPatch } = require('../index');
        const buffer = fs.readFileSync('./test/data/patch.bin');
        const patch = new ZoiaPatch(buffer);
        assert.deepEqual(patch.schema,
            {
                "name": "abcdEfghijklmno",
                "modules": {
                    "data": [
                        {
                            "meta": {
                                "len": 14,
                                "type": 1,
                                "typeName": "audio_input",
                                "unknown": 0,
                                "pageNumber": 0,
                                "colour": 3,
                                "colourName": "Red",
                                "gridPosition": 0,
                                "numberOfParams": 0,
                                "modVersion": 0,
                                "options": [
                                    1,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                "params": [],
                                "name": ""
                            },
                            "display": {
                                "niceName": "audio input",
                                "buttons": [
                                    {
                                        "label": "pedal input L"
                                    }
                                ]
                            }
                        },
                        {
                            "meta": {
                                "len": 14,
                                "type": 2,
                                "typeName": "audio_output",
                                "unknown": 0,
                                "pageNumber": 0,
                                "colour": 3,
                                "colourName": "Red",
                                "gridPosition": 7,
                                "numberOfParams": 0,
                                "modVersion": 0,
                                "options": [
                                    0,
                                    1,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                "params": [],
                                "name": ""
                            },
                            "display": {
                                "niceName": "audio output",
                                "buttons": [
                                    {
                                        "label": "pedal output L"
                                    }
                                ]
                            }
                        },
                        {
                            "meta": {
                                "len": 16,
                                "type": 11,
                                "typeName": "OD & DistorLon",
                                "unknown": 0,
                                "pageNumber": 0,
                                "colour": 2,
                                "colourName": "Green",
                                "gridPosition": 18,
                                "numberOfParams": 2,
                                "modVersion": 0,
                                "options": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                "params": [
                                    0,
                                    65535
                                ],
                                "name": ""
                            },
                            "display": {
                                "niceName": "OD & DistorLon",
                                "buttons": [
                                    {
                                        "label": "UNKNOWN MODULE"
                                    }
                                ]
                            }
                        },
                        {
                            "meta": {
                                "len": 16,
                                "type": 11,
                                "typeName": "OD & DistorLon",
                                "unknown": 0,
                                "pageNumber": 0,
                                "colour": 1,
                                "colourName": "Blue",
                                "gridPosition": 26,
                                "numberOfParams": 2,
                                "modVersion": 0,
                                "options": [
                                    1,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                "params": [
                                    32663,
                                    32629
                                ],
                                "name": "pat dist"
                            },
                            "display": {
                                "niceName": "OD & DistorLon",
                                "buttons": [
                                    {
                                        "label": "UNKNOWN MODULE"
                                    }
                                ]
                            }
                        },
                        {
                            "meta": {
                                "len": 18,
                                "type": 74,
                                "typeName": "Hall Reverb",
                                "unknown": 0,
                                "pageNumber": 1,
                                "colour": 7,
                                "colourName": "White",
                                "gridPosition": 24,
                                "numberOfParams": 4,
                                "modVersion": 0,
                                "options": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0
                                ],
                                "params": [
                                    32767,
                                    32768,
                                    32767,
                                    32767
                                ],
                                "name": ""
                            },
                            "display": {
                                "niceName": "Hall Reverb",
                                "buttons": [
                                    {
                                        "label": "UNKNOWN MODULE"
                                    }
                                ]
                            }
                        }
                    ],
                    "count": 5,
                    "offsetEnd": 84
                },
                "connections": {
                    "data": [
                        {
                            "sourceModule": 0,
                            "sourceOutput": 0,
                            "destinationModule": 2,
                            "destinationInput": 0,
                            "signalStrength": 10000
                        },
                        {
                            "sourceModule": 2,
                            "sourceOutput": 2,
                            "destinationModule": 3,
                            "destinationInput": 0,
                            "signalStrength": 10000
                        },
                        {
                            "sourceModule": 3,
                            "sourceOutput": 2,
                            "destinationModule": 1,
                            "destinationInput": 0,
                            "signalStrength": 10000
                        }
                    ],
                    "count": 3,
                    "offsetEnd": 100
                },
                "pages": {
                    "data": [],
                    "count": 0,
                    "offsetEnd": 101
                }
            }
        );
    });
});
