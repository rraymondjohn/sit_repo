from picamera2 import Picamera2
import cv2
import mediapipe as mp
import time
import os
import RPi.GPIO as GPIO
from flask import Flask, Response
from gpiozero import LED

app = Flask(__name__)

# Initialize camera
picam2 = Picamera2()
config = picam2.create_preview_configuration(main={"size": (640, 480), "format": "BGR888"})
picam2.configure(config)
picam2.start()

# Initialize MediaPipe Hands and Face Detection
mp_hands = mp.solutions.hands
mp_face_detection = mp.solutions.face_detection
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Setup GPIO for LED
green_led = LED(27)
red_led = LED(22)
green_led.off()
red_led.on()

# Function to send commands to MagicMirror
def send_mm_command(command):
    os.system(f"curl -X GET 'http://localhost:8080/api/notification/CAROUSEL_{command.upper()}?apiKey=12341234'")

# Function to control screen
def set_screen_state(state):
    if state == "on":
        green_led.on()
        red_led.off()
    else:
        green_led.off()
        red_led.on()

current_slide = 0
slide_count = 3
screen_on = False
last_face_time = 0
timeout = 10  # Seconds before screen turns off

def generate_frames():
    global current_slide, screen_on, last_face_time
    while True:
        frame = picam2.capture_array()
        if frame.shape[2] == 4:
            frame = frame[:, :, :3]
        frame = cv2.flip(frame, 1)  # Flip horizontally
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Face detection
        face_results = face_detection.process(frame_rgb)
        if face_results.detections:
            last_face_time = time.time()
            if not screen_on:
                set_screen_state("on")
                screen_on = True
            for detection in face_results.detections:
                mp_drawing.draw_detection(frame, detection)
        elif screen_on and (time.time() - last_face_time > timeout):
            set_screen_state("off")
            screen_on = False

        # Hand detection (only when screen is on)
        if screen_on:
            hand_results = hands.process(frame_rgb)
            if hand_results.multi_hand_landmarks:
                for hand_landmarks in hand_results.multi_hand_landmarks:
                    mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                    x = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP].x
                    if x < 0.3 and current_slide > 0:
                        current_slide -= 1
                        send_mm_command("previous")
                        print("Previous slide")
                        time.sleep(2)
                    elif x > 0.7 and current_slide < slide_count - 1:
                        current_slide += 1
                        send_mm_command("next")
                        print("Next slide")
                        time.sleep(2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    try:
        app.run(host='0.0.0.0', port=5000, threaded=True)
    finally:
        picam2.stop()
