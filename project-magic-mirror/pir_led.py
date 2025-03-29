from gpiozero import LED
from gpiozero import MotionSensor
from time import sleep

green_led = LED(27)
red_led = LED(22)
pir = MotionSensor(17)
green_led.off()
red_led.on()

sleep(2)

last_state = False

while True:
	current_state = pir.motion_detected
	
	if current_state and not last_state:
		print("Motion detected")
		green_led.on()
		red_led.off()
	elif not current_state and last_state:
		print("No motion has been detected for a while")
		green_led.off()
		red_led.on()
		
	last_state = current_state	
	sleep(0.1)
		
