import os
import cv2
import json
import numpy as np
import mediapipe as mp
from tqdm import tqdm

# ================= CONFIG =================
DATA_DIR = r"D:\Full-stack-Resources-and-Files\Niral\Sign2Voice_Model\data\raw"
OUTPUT_DIR = r"D:\Full-stack-Resources-and-Files\Niral\Sign2Voice_Model\data\processed"

SEQUENCE_LENGTH = 30
WINDOW_STEP = 5

# ================= MEDIAPIPE =================
mp_holistic = mp.solutions.holistic


# ================= NORMALIZATION =================
def normalize_landmarks(landmarks):
    """
    Normalize landmarks relative to first landmark.
    """

    if len(landmarks) == 0:
        return landmarks

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


# ================= KEYPOINT EXTRACTION =================
def extract_keypoints(results):

    # LEFT HAND
    lh = np.zeros(21 * 3)

    if results.left_hand_landmarks:
        lh = np.array(
            normalize_landmarks(results.left_hand_landmarks.landmark)
        )

    # RIGHT HAND
    rh = np.zeros(21 * 3)

    if results.right_hand_landmarks:
        rh = np.array(
            normalize_landmarks(results.right_hand_landmarks.landmark)
        )

    # POSE
    pose = np.zeros(33 * 3)

    if results.pose_landmarks:
        pose = np.array(
            normalize_landmarks(results.pose_landmarks.landmark)
        )

    return np.concatenate([lh, rh, pose])


# ================= VIDEO PROCESSING =================
def process_video(video_path):

    cap = cv2.VideoCapture(video_path)

    frames = []

    with mp_holistic.Holistic(
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as holistic:

        while True:

            ret, frame = cap.read()

            if not ret:
                break

            # Optional flip
            frame = cv2.flip(frame, 1)

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            results = holistic.process(rgb)

            keypoints = extract_keypoints(results)

            frames.append(keypoints)

    cap.release()

    return frames


# ================= CREATE SEQUENCES =================
def create_sequences(frames):

    sequences = []

    # If enough frames -> sliding window
    if len(frames) >= SEQUENCE_LENGTH:

        for start in range(
            0,
            len(frames) - SEQUENCE_LENGTH + 1,
            WINDOW_STEP
        ):

            sequence = frames[start:start + SEQUENCE_LENGTH]

            sequences.append(sequence)

    else:
        # Pad using last valid frame
        while len(frames) < SEQUENCE_LENGTH:
            frames.append(frames[-1])

        sequences.append(frames)

    return sequences


# ================= MAIN =================
def main():

    X = []
    y = []

    labels = sorted(os.listdir(DATA_DIR))

    label_map = {
        label: idx
        for idx, label in enumerate(labels)
    }

    print("\nLabel Map:")
    print(label_map)

    for label in labels:

        class_path = os.path.join(DATA_DIR, label)

        videos = os.listdir(class_path)

        for video in tqdm(videos, desc=f"Processing {label}"):

            video_path = os.path.join(class_path, video)

            try:

                frames = process_video(video_path)

                if len(frames) == 0:
                    continue

                sequences = create_sequences(frames)

                for seq in sequences:
                    X.append(seq)
                    y.append(label_map[label])

            except Exception as e:
                print(f"\nError processing {video_path}")
                print(e)

    X = np.array(X)
    y = np.array(y)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    np.save(os.path.join(OUTPUT_DIR, "X.npy"), X)
    np.save(os.path.join(OUTPUT_DIR, "y.npy"), y)

    with open(os.path.join(OUTPUT_DIR, "labels.json"), "w") as f:
        json.dump(label_map, f)

    print("\n========== SAVED ==========")
    print("X shape:", X.shape)
    print("y shape:", y.shape)


if __name__ == "__main__":
    main()