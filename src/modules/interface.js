/*
 *
 * options - label: nice name
 *         - values: { label: nice name, value: as given in the patch }
 * buttons - { label: nice name }
 * buttonLogic - (definition, options_from_patch) => [ ... buttons to show ... ]
 */
module.exports = {
    audio_input: {
        niceName: 'audio input',
        options: [
            {
                label: 'channels',
                values: [{ label: 'stereo', value: 0 }, { label: 'left', value: 1 }, { label: 'right', value: 2 }]
            }
        ],
        buttons: [
            { label: 'pedal input L' },
            { label: 'pedal input R' }
        ],
        buttonLogic: ({buttons}, [channels]) => {
            switch (channels) {
                case 1: return [buttons[0]];
                case 2: return [buttons[1]];
                default: return buttons;
            }
        }
    },
    audio_output: {
        niceName: 'audio output',
        options: [
            { label: 'gain control', values: [{ label: 'off', value: 0 }, { label: 'on', value: 1 }] },
            {
                label: 'channels',
                values: [{ label: 'stereo', value: 0 }, { label: 'left', value: 1 }, { label: 'right', value: 2 }]
            }
        ],
        buttons: [
            { label: 'pedal output L' },
            { label: 'pedal output R' },
            { label: 'gain', valueIdx: 0 }
        ],
        buttonLogic: ({buttons}, [gain, channels]) => ([
            ...(channels < 2 ? [buttons[0]] : []),
            ...([0, 2].includes(channels) ? [buttons[1]] : []),
            ...(gain ? [buttons[2]] : [])
        ])
    },
    midi_notes_in: {
        niceName: 'midi notes in',
        options: [
            {
                label: 'midi channel',
                numeric: { min: 1, max: 16 }
            },
            {
                label: '# of outputs',
                numeric: { min: 1, max: 8 }
            },
            {
                label: 'priority',
                values: [{ label: 'newest', value: 0 }, { label: 'oldest', value: 1 }, { label: 'lowest', value: 2 }, { label: 'highest', value: 3 }, { label: 'RoundRobin', value: 4 }]
            },
            {
                label: 'greedy',
                values: [{ label: 'no', value: 0 }, { label: 'yes', value: 1 }]
            },
            {
                label: 'velocity output',
                values: [{ label: 'off', value: 0 }, { label: 'on', values: 1 }]
            }
        ],
        buttons: [
            { label: 'notes out' },
            { label: 'gate out' },
            { label: 'velocity out' },
            { label: 'trigger out' }
        ],
        buttonLogic: ({buttons}, [_, outputNumber, _, _, velocityOut, _, _, triggerOut]) => {
            return (new Array(outputNumber)).fill(null).reduce((acc) => ([
                ...acc,
                ...[
                    buttons[0],
                    buttons[1],
                    ...(velocityOut ? [buttons[2]] : []),
                    ...(triggerOut ? [buttons[3]] : [])
                ]
            ]), []);
        }
    },
    midi_pitch_bend_in: {
        niceName: 'midi pitch bend in',
        options: [
            {
                label: 'midi channel',
                numeric: { min: 1, max: 16 }
            }
        ],
        buttons: [
            { label: 'pitch bend' }
        ]
    },
    midi_cc_in: {
        niceName: 'midi cc in',
        options: [
            {
                label: 'midi channel',
                numeric: { min: 1, max: 16 }
            },
            {
                label: 'controller',
                numeric: { min: 0, max: 127 }
            },
            {
                label: 'output',
                values: [{ label: '0 to 1', value: 0 }, { label: '-1 to 1', value: 1 }]
            }
        ],
        buttons: [
            { label: 'cc value' }
        ]
    },
    midi_pressure: {
        niceName: 'midi pressure',
        options: [
            {
                label: 'midi channel',
                numeric: { min: 1, max: 16 }
            }
        ],
        buttons: [
            { label: 'channel pressure' }
        ]
    },
    midi_clock_in: {
        niceName: 'midi clock in',
        options: [
            { label: 'clock out', values: [{ label: 'disabled', value: 0 }, { label: 'enabled', value: 1 }] },
            { label: 'reset out', values: [{ label: 'disabled', value: 0 }, { label: 'enabled', value: 1 }] },
            { label: 'run out', values: [{ label: 'disabled', value: 0 }, { label: 'enabled', value: 1 }] },
            {
                label: 'beat modifier',
                values: [
                    { label: 1, value: 0 }, { label: 2, value: 0 }, { label: 3, value: 0 }, { label: 4, value: 0 }, { label: 6, value: 0 }, { label: 12, value: 0 },
                    { label: '1/12', value: 0 }, { label: '1/6', value: 0 }, { label: '1/4', value: 0 }, { label: '1/3', value: 0 }, { label: '1/2', value: 0 }
                ]
            }
        ],
        buttons: [
            { label: 'quarter out' }
        ]
    }
};

const numericOptions = (max, min = 1) => (new Array(max - min)).fill(null).map((_, i) => ({ label: min+i, value: i }));
