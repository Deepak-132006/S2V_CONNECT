import cv2
import time
import threading
import numpy as np
import mediapipe as mp
import tensorflow as tf
import pyttsx3

from collections import deque, Counter

# ================= CONFIG =================

MODEL_PATH = r"D:\Full-stack-Resources-and-Files\Niral\Sign2Voice_Model\models\best_bilstm.keras"

LABELS = {
    0: "doubt",
    1: "hello",
    2: "help",
    3: "no",
    4: "yes"
}

SEQ_LEN = 30

CONFIDENCE_THRESHOLD = 0.85

PREDICT_EVERY = 2

SMOOTHING_WINDOW = 5
MAJORITY_VOTE = 3

DISPLAY_TIME = 2

# ================= LOAD MODEL =================

print("\nLoading model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.")

# ================= TEXT TO SPEECH =================

engine = pyttsx3.init()
engine.setProperty("rate", 170)

speaking = False

def speak_async(word):

    global speaking

    if speaking:
        return

    def run():
        global speaking

        speaking = True

        engine.say(word)
        engine.runAndWait()

        speaking = False

    threading.Thread(target=run, daemon=True).start()

# ================= MEDIAPIPE =================

mp_holistic = mp.solutions.holistic
mp_draw = mp.solutions.drawing_utils

# ================= NORMALIZATION =================

def normalize_landmarks(landmarks):

    if len(landmarks) == 0:
        return []

    origin_x = landmarks[0].x
    origin_y = landmarks[0].y
    origin_z = landmarks[0].z

    normalized = []

    for lm in landmarks:

        normalized.extend([
            lm.x - origin_x,
            lm.y - origin_y,
            lm.z - origin_z
        ])

    return normalized

# ================= FEATURE EXTRACTION =================

def extract_keypoints(results):

    # LEFT HAND
    left_hand = np.zeros(21 * 3)

    if results.left_hand_landmarks:

        left_hand = np.array(
            normalize_landmarks(
                results.left_hand_landmarks.landmark
            )
        )

    # RIGHT HAND
    right_hand = np.zeros(21 * 3)

    if results.right_hand_landmarks:

        right_hand = np.array(
            normalize_landmarks(
                results.right_hand_landmarks.landmark
            )
        )

    # POSE
    pose = np.zeros(33 * 3)

    if results.pose_landmarks:

        pose = np.array(
            normalize_landmarks(
                results.pose_landmarks.landmark
            )
        )

    return np.concatenate([
        left_hand,
        right_hand,
        pose
    ])

# ================= STATES =================

sequence = deque(maxlen=SEQ_LEN)

prediction_history = deque(maxlen=SMOOTHING_WINDOW)

display_word = "SHOW SIGN"

spoken_word = None

last_display_time = time.time()

frame_counter = 0

# ================= CAMERA =================

cap = cv2.VideoCapture(0)

with mp_holistic.Holistic(

    static_image_mode=False,

    model_complexity=1,

    smooth_landmarks=True,

    min_detection_confidence=0.6,

    min_tracking_confidence=0.6

) as holistic:

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        # Flip for mirror view
        frame = cv2.flip(frame, 1)

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = holistic.process(rgb)

        # ================= DRAW LANDMARKS =================

        if results.left_hand_landmarks:

            mp_draw.draw_landmarks(
                frame,
                results.left_hand_landmarks,
                mp_holistic.HAND_CONNECTIONS
            )

        if results.right_hand_landmarks:

            mp_draw.draw_landmarks(
                frame,
                results.right_hand_landmarks,
                mp_holistic.HAND_CONNECTIONS
            )

        if results.pose_landmarks:

            mp_draw.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_holistic.POSE_CONNECTIONS
            )

        # ================= FEATURE EXTRACTION =================

        keypoints = extract_keypoints(results)

        # Check if any landmarks exist
        if np.sum(keypoints) != 0:

            sequence.append(keypoints)

        else:

            sequence.clear()
            prediction_history.clear()

            display_word = "SHOW SIGN"

        # ================= PREDICTION =================

        if len(sequence) == SEQ_LEN:

            frame_counter += 1

            if frame_counter % PREDICT_EVERY == 0:

                input_data = np.expand_dims(
                    np.array(sequence),
                    axis=0
                )

                prediction = model.predict(
                    input_data,
                    verbose=0
                )[0]

                predicted_class = np.argmax(prediction)

                confidence = prediction[predicted_class]

                # Store confident predictions only
                if confidence >= CONFIDENCE_THRESHOLD:

                    prediction_history.append(predicted_class)

                # ================= SMOOTHING =================

                if len(prediction_history) == SMOOTHING_WINDOW:

                    most_common = Counter(
                        prediction_history
                    ).most_common(1)[0]

                    predicted_idx = most_common[0]

                    count = most_common[1]

                    if count >= MAJORITY_VOTE:

                        word = LABELS[predicted_idx]

                        display_word = f"{word.upper()} ({confidence:.2f})"

                        last_display_time = time.time()

                        # Speak once
                        if spoken_word != word:

                            speak_async(word)

                            spoken_word = word

                    prediction_history.clear()

        # ================= DISPLAY RESET =================

        if (
            time.time() - last_display_time > DISPLAY_TIME
            and display_word != "SHOW SIGN"
        ):

            display_word = "SHOW SIGN"

        # ================= UI =================

        cv2.rectangle(
            frame,
            (0, 0),
            (900, 70),
            (0, 0, 0),
            -1
        )

        cv2.putText(
            frame,
            display_word,
            (20, 45),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        cv2.imshow(
            "Sign2Voice AI",
            frame
        )

        # ================= EXIT =================

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# ================= CLEANUP =================

cap.release()

cv2.destroyAllWindows()