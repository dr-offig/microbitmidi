control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    noteOffTriggers[0] = 1
})
function updateTiltRoll () {
    if (input.rotation(Rotation.Roll) != previousRoll) {
        previousRoll = input.rotation(Rotation.Roll)
        serial.writeLine("MIDI ControlChange " + tiltRollControlNumber + " " + Math.round((Math.constrain(input.rotation(Rotation.Roll), -90, 90) / 90 + 1) / 2 * 127) + " 0")
    }
}
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    noteOnTriggers[0] = 1
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    noteOffTriggers[7] = 1
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    noteOnTriggers[7] = 1
})
function extendArray (arr: number[], size: number, value: number) {
    for (let index = 0; index <= size - 1; index++) {
        arr.push(value)
    }
}
function updateTiltPitch () {
    if (input.rotation(Rotation.Pitch) != previousPitch) {
        previousPitch = input.rotation(Rotation.Pitch)
        serial.writeLine("MIDI ControlChange " + tiltPitchControlNumber + " " + Math.round((Math.constrain(input.rotation(Rotation.Pitch), -90, 90) / 90 + 1) / 2 * 127) + " 0")
    }
}
function updateBeat () {
    let previousTime = 0
    currentTime = control.millis()
    delta_t = currentTime - previousTime
    delta_b = delta_t * tempo / 60000
    beat = beat + delta_b
    frac = beat % 1
    if (beatTrigger == 0 && frac > 0.5) {
        beatTrigger = 1
    } else if (beatTrigger == 1 && frac < 0.5) {
        beatTrigger = 0
        wholeBeat = beat - beat % 1
    }
}
let wholeBeat = 0
let beatTrigger = 0
let frac = 0
let delta_b = 0
let delta_t = 0
let noteOffTriggers: number[] = []
let noteOnTriggers: number[] = []
let tiltRollControlNumber = 0
let tiltPitchControlNumber = 0
let previousPitch = 0
let previousRoll = 0
let tempo = 0
let currentTime = 0
let beat = 0
serial.setBaudRate(BaudRate.BaudRate9600)
beat = 0
let baseNote = 36
let numNotes = 24
currentTime = control.millis()
tempo = 120
previousRoll = input.rotation(Rotation.Roll)
previousPitch = input.rotation(Rotation.Pitch)
tiltPitchControlNumber = 0
tiltRollControlNumber = 1
noteOnTriggers = []
noteOffTriggers = []
extendArray(noteOnTriggers, numNotes - 1, 0)
extendArray(noteOffTriggers, numNotes - 1, 0)
basic.showIcon(IconNames.SmallDiamond)
basic.showIcon(IconNames.SmallSquare)
basic.showIcon(IconNames.Diamond)
basic.showIcon(IconNames.Square)
basic.showIcon(IconNames.Yes)
basic.forever(function () {
    updateBeat()
    updateTiltPitch()
    updateTiltRoll()
    for (let index2 = 0; index2 <= noteOnTriggers.length - 1; index2++) {
        if (noteOnTriggers[index2] == 1) {
            noteOnTriggers[index2] = 0
            serial.writeLine("MIDI NoteOn " + convertToText(baseNote + index2) + " 100 0")
        }
    }
    for (let index222 = 0; index222 <= noteOffTriggers.length - 1; index222++) {
        if (noteOffTriggers[index222] == 1) {
            noteOffTriggers[index222] = 0
            serial.writeLine("MIDI NoteOff " + convertToText(baseNote + index222) + " 100 0")
        }
    }
    basic.pause(1)
})
