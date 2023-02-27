def on_button_pressed_a():
    serial.write_line("")
input.on_button_pressed(Button.A, on_button_pressed_a)

basic.show_icon(IconNames.SMALL_DIAMOND)
basic.show_icon(IconNames.SMALL_SQUARE)
basic.show_icon(IconNames.DIAMOND)
basic.show_icon(IconNames.SQUARE)
basic.show_icon(IconNames.YES)

def on_forever():
    pass
basic.forever(on_forever)
