/*
 *
 * options - label: nice name
 *         - values: { label: nice name, value: as given in the patch }
 * buttons - { label: nice name }
 * buttonLogic - (definition, options_from_patch) => [ ... buttons to show ... ]
 *
 * 3003 = patchstorage zoia platform id
 * PATCH STORAGE API URL: https://patchstorage.com/api/alpha/patches?platforms=3003
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
        // (thisSchema, optionsReadFromPatchArr)
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
        buttonLogic: ({buttons}, [_1, outputNumber, _2, _3, velocityOut, _, _4, triggerOut]) => {
            return (new Array(outputNumber+1)).fill(null).reduce((acc) => ([
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
            { label: 'quarter out' },
            { label: 'clock out' },
            { label: 'reset out' },
            { label: 'running output' }
        ],
        buttonLogic: ({ buttons }, [clockOut, resetOut, runOut]) => ([
            buttons[0],
            ...(clockOut ? [buttons[1]] : []),
            ...(resetOut ? [buttons[2]] : []),
            ...(runOut ? [buttons[3]] : [])
        ])
    },
    midi_cc_out: {
        niceName: 'midi cc out',
        options: [
            { label: 'midi channel', numeric: { min: 1, max: 16 } },
            { label: 'controller', numeric: { min: 0, max: 127 } }
        ],
        buttons: [ { label: 'cc out' } ]
    },
    midi_pc_out: {
        niceName: 'midi pc out',
        options: [
            { label: 'midi channel', numeric: { min: 1, max: 16 } }
        ],
        buttons: [{ label: 'pc out' }, { label: 'trigger in' }]
    },
    midi_note_out: {
        niceName: 'midi note out',
        options: [
            { label: 'midi channel', numeric: { min: 1, max: 16 } },
            { label: 'velocity output', values: [{ label: 'off', value: 0 }, { label: 'on', value: 1 }] }
        ],
        buttons: [
            { label: 'note in' },
            { label: 'gate in' },
            { label: 'velocity out' }
        ],
        buttonLogic: ({ buttons }, [_1, velocityOut]) => ([
            buttons[0],
            buttons[1],
            ...(velocityOut ? [buttons[2]] : [])
        ])
    },
    midi_clock_out: {
        niceName: 'midi clock out',
        options: [
            { label: 'input', values: [{ label: 'tap', value: 0 }, { label: 'cv control', value: 1 }] },
            { label: 'run in', values: [{ label: 'enabled', value: 0 }, { label: 'disabled', value: 1 }] },
            { label: 'reset in', values: [{ label: 'enabled', value: 0 }, { label: 'disabled', value: 1 }] },
            { label: 'position', values: [{ label: 'disabled', value: 0 }, { label: 'enabled', value: 1 }] }
        ],
        buttons: [
            { label: 'tap control' },
            { label: 'sent' },
            { label: 'reset' },
            { label: 'send position' },
            { label: 'song position' }
        ],
        buttonLogic: ({ buttons }, [_1, runIn, resetIn, position]) => ([
            buttons[0],
            ...(runIn ? [buttons[1]] : []),
            ...(resetIn ? [buttons[2]] : []),
            ...(!position ? [buttons[3], buttons[4]] : [])
        ])
    },
    stomp_switch: {
        niceName: 'stomp switch',
        options: [
            {
                label: 'stompswitch',
                values: [
                    { label: 'left', value: 0 },
                    { label: 'middle', value: 1 },
                    { label: 'right', value: 2 },
                    { label: 'ext', value: 3 }
                ]
            },
            { label: 'action', values: [{ label: 'momentary', value: 0 }, { label: 'latching', value: 1 }] },
            { label: 'normally', value: [{ label: 'zero', value: 0 }, { label: 'one', value: 1 }] }
        ],
        buttons: [
            { label: 'cv output' }
        ]
    },
    pixel: {
        niceName: 'pixel',
        options: [
            { label: 'control', values: [{ label: 'cv', value: 0 }, { label: 'audio', value: 1 }] }
        ],
        buttons: [
            { label: 'cv in' }
        ],
        buttonLogic: (_1, [control]) => {
            if (control === 0) {
                return { label: 'cv in' };
            }
            return { label: 'auduo in' };
        }
    },
    ui_button: {
        niceName: 'ui button',
        options: [
            { label: 'cv output', values: [{ label: 'disabled', value: 0 }, { label: 'enabled', value: 1 }] },
            { label: 'range', values: [{ label: 'extended', value: 0 }, { label: 'basic', value: 1 }] }
        ],
        buttons: [
            { label: 'in' },
            { label: 'cv output' }
        ],
        buttonLogic: ({ buttons }, [cvOutput]) => ([
            buttons[0],
            ...(cvOutput ? [buttons[1]] : [])
        ])
    },
    pushbutton: {
        niceName: 'pushbutton',
        options: [
            { label: 'action', values: [{ label: 'momentary', value: 0 }, { label: 'latching', value: 1 }] },
            { label: 'normally', value: [{ label: 'zero', value: 0 }, { label: 'one', value: 1 }] }
        ],
        buttons: [
            { label: 'switch' }
        ]
    },
    keyboard: {
        niceName: 'keyboard',
        options: [
            { label: '# of notes', numeric: { min: 1, max: 40 } }
        ],
        buttons: [
            { label: 'note 1' },
            { label: 'note out' },
            { label: 'gate out' },
            { label: 'trigger out' }
        ],
        buttonLogic: ({ buttons }, [noOfNotes]) => ([
            ...(new Array(noOfNotes+1)).fill(null).map((_, idx) => ({ label: `note ${idx+1}` })),
            ...buttons.slice(1)
        ])
    },
    cport_exp_cv_in: {
        niceName: 'cport exp/cv in',
        options: [
            { label: 'output', values: [{ label: '0 to 1', value: 0 }, { label: '-1 to 1', value: 1 }] }
        ],
        buttons: [
            { label: 'cv output' }
        ]
    },
    cport_cv_out: {
        niceName: 'cport cv out',
        options: [
            { label: 'input range', values: [{ label: '0 to 1', value: 0 }, { label: '-1 to 1', value: 1 }] }
        ],
        buttons: [
            { label: 'cv input' }
        ]
    }
};
