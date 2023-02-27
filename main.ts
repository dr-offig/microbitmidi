control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    serial.writeString("" + ("MIDI NoteOff 60 100 0\n"))
    control.inBackground(function () {
        basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    })
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    serial.writeString("" + ("MIDI NoteOn 60 100 0\n"))
    control.inBackground(function () {
        basic.showLeds(`
        # # # # #
        # . . . #
        # # # # #
        # . . . #
        # . . . #
        `)
    })
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_UP, function () {
    serial.writeString("" + ("MIDI NoteOff 65 100 0\n"))
    control.inBackground(function () {
        basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    })
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    serial.writeString("" + ("MIDI NoteOn 65 100 0\n"))
    control.inBackground(function() {
        basic.showLeds(`
        . # . . .
        . # . . .
        . # # # .
        . # . # .
        . # # # .
        `)
    })
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    basic.showString(serial.readUntil(serial.delimiters(Delimiters.NewLine)))
})
let wholeBeat = 0
let frac = 0
let delta_b = 0
let delta_t = 0
let beat = 0
let currentTime = control.millis()
let tempo = 120
let buttonPressed = -1
let previousButtonPressed = -1
let beatTrigger = 1
let previousRoll = input.rotation(Rotation.Roll)
let previousPitch = input.rotation(Rotation.Pitch)
basic.showIcon(IconNames.SmallDiamond)
basic.showIcon(IconNames.SmallSquare)
basic.showIcon(IconNames.Diamond)
basic.showIcon(IconNames.Square)
basic.showIcon(IconNames.Yes)
basic.forever(function () {
    let previousTime = 0
    beat = 0
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
    if (input.rotation(Rotation.Roll) != previousRoll) {
        previousRoll = input.rotation(Rotation.Roll)
        serial.writeString("MIDI ControlChange 0 " + Math.round((Math.constrain(input.rotation(Rotation.Roll), -90, 90) / 90 + 1) / 2 * 127) + " 0 \n")
    }
    if (input.rotation(Rotation.Pitch) != previousPitch) {
        previousPitch = input.rotation(Rotation.Pitch)
        serial.writeString("MIDI ControlChange 1 " + Math.round((Math.constrain(input.rotation(Rotation.Pitch), -90, 90) / 90 + 1) / 2 * 127) + " 0 \n")
    }
    basic.pause(1)
})
