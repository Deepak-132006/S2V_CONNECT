import os
import json
import numpy as np
import tensorflow as tf

from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

from tensorflow.keras.models import Sequential

from tensorflow.keras.layers import (
    Bidirectional,
    LSTM,
    Dense,
    Dropout,
    BatchNormalization
)

from tensorflow.keras.callbacks import (
    EarlyStopping,
    ReduceLROnPlateau,
    ModelCheckpoint
)

from tensorflow.keras.utils import to_categorical

# ================= CONFIG =================

BASE_PATH = r"D:\Full-stack-Resources-and-Files\Niral\Sign2Voice_Model"

DATA_PATH = os.path.join(BASE_PATH, "data", "processed")

MODEL_DIR = os.path.join(BASE_PATH, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "best_bilstm.keras")

EPOCHS = 80
BATCH_SIZE = 32

SEQUENCE_LENGTH = 30
FEATURES = 225

# ================= LOAD DATA =================

print("\nLoading dataset...")

X = np.load(os.path.join(DATA_PATH, "X.npy"))
y = np.load(os.path.join(DATA_PATH, "y.npy"))

print("X shape:", X.shape)
print("y shape:", y.shape)

NUM_CLASSES = len(np.unique(y))

# ================= ONE HOT =================

y_cat = to_categorical(y, NUM_CLASSES)

# ================= TRAIN SPLIT =================

X_train, X_temp, y_train, y_temp, y_raw_train, y_raw_temp = train_test_split(
    X,
    y_cat,
    y,
    test_size=0.30,
    stratify=y,
    random_state=42,
    shuffle=True
)

X_val, X_test, y_val, y_test, y_raw_val, y_raw_test = train_test_split(
    X_temp,
    y_temp,
    y_raw_temp,
    test_size=0.50,
    stratify=y_raw_temp,
    random_state=42,
    shuffle=True
)

print("\nDataset Split:")
print("Train:", X_train.shape)
print("Val  :", X_val.shape)
print("Test :", X_test.shape)

# ================= CLASS WEIGHTS =================

weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(y),
    y=y
)

class_weights = {
    i: weights[i]
    for i in range(len(weights))
}

print("\nClass Weights:")
print(class_weights)

# ================= MODEL =================

print("\nBuilding model...")

model = Sequential([

    # -------- FIRST BILSTM --------
    Bidirectional(
        LSTM(
            64,
            return_sequences=True
        ),
        input_shape=(SEQUENCE_LENGTH, FEATURES)
    ),

    Dropout(0.3),

    # -------- SECOND BILSTM --------
    Bidirectional(
        LSTM(
            64
        )
    ),

    Dropout(0.3),

    # -------- DENSE --------
    Dense(64, activation='relu'),

    BatchNormalization(),

    Dropout(0.3),

    # -------- OUTPUT --------
    Dense(NUM_CLASSES, activation='softmax')

])

# ================= COMPILE =================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),

    loss='categorical_crossentropy',

    metrics=['accuracy']
)

# ================= SUMMARY =================

print("\nModel Summary:")
model.summary()

# ================= CALLBACKS =================

os.makedirs(MODEL_DIR, exist_ok=True)

callbacks = [

    EarlyStopping(
        monitor='val_loss',
        patience=12,
        restore_best_weights=True,
        verbose=1
    ),

    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=4,
        min_lr=1e-6,
        verbose=1
    ),

    ModelCheckpoint(
        MODEL_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )

]

# ================= TRAIN =================

print("\nStarting Training...\n")

history = model.fit(

    X_train,
    y_train,

    validation_data=(X_val, y_val),

    epochs=EPOCHS,

    batch_size=BATCH_SIZE,

    class_weight=class_weights,

    callbacks=callbacks,

    verbose=1

)

# ================= EVALUATE =================

print("\nEvaluating on Test Set...")

loss, accuracy = model.evaluate(
    X_test,
    y_test,
    verbose=0
)

print(f"\nTest Accuracy: {accuracy:.4f}")

# ================= PREDICTIONS =================

predictions = model.predict(X_test)

pred_labels = np.argmax(predictions, axis=1)

true_labels = np.argmax(y_test, axis=1)

# ================= REPORT =================

print("\nClassification Report:\n")

print(
    classification_report(
        true_labels,
        pred_labels
    )
)

print("\nConfusion Matrix:\n")

print(
    confusion_matrix(
        true_labels,
        pred_labels
    )
)

print("\nTraining Complete.")
print(f"Best model saved at:\n{MODEL_PATH}")