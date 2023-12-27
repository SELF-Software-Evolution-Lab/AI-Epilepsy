import cv2
import joblib
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, f1_score
from sklearn.model_selection import train_test_split
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.models import Sequential
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical

# Utilities
def make_square(images):
    squared_images = []
    for image in images:
        height, width = image.shape[:2]
        larger_side = max(height, width)
        vertical_padding = (larger_side - height) // 2
        horizontal_padding = (larger_side - width) // 2
    
        square_image = np.zeros((larger_side, larger_side), dtype=np.uint8)
        square_image[vertical_padding:vertical_padding+height, horizontal_padding:horizontal_padding+width] = image
        square_image_resized = cv2.resize(square_image, (256, 256))
    
        squared_images.append(square_image_resized)
    return np.array(squared_images)

# Import original mri images
data = np.load('mri_data.npy')

# Split the dataset in half randomly
indices = np.random.permutation(len(data))
data = data[indices[:len(indices) // 2]]
indices = np.random.permutation(len(data))

# Split the indices in three parts that are equal considering that each sagittal corresponds to 160 images, and each coronal/axial to 256
sagittal_indices = indices[:35]
coronal_indices = indices[35: 57]
axial_indices = indices[57:79]

# Create the three splits using the indices
data_split1 = data[sagittal_indices]
data_split2 = data[coronal_indices]
data_split3 = data[axial_indices]

# Transpose the arrays to get the respective viewpoint
x, y, z, w = data_split1.shape
data_split1 = data_split1.reshape(x * y, z, w)
x, y, z, w = data_split2.shape
data_split2 = data_split2.transpose(0, 2, 1, 3).reshape(x * z, y, w)
x, y, z, w = data_split3.shape
data_split3 = data_split3.transpose(0, 3, 1, 2).reshape(x * w, y, z)

# Create labels for each split
labels_split1 = np.zeros(len(data_split1), dtype=int)     # Label '0' for sagittal
labels_split2 = np.ones(len(data_split2), dtype=int)      # Label '1' for coronal
labels_split3 = np.full(len(data_split3), 2, dtype=int)   # Label '2' for axial

# Split the resulting dataset into training and testing
X_train1, X_test1, y_train1, y_test1 = train_test_split(
    data_split1,
    labels_split1,
    test_size=0.2,
    random_state=42
)
X_train2, X_test2, y_train2, y_test2 = train_test_split(
    data_split2,
    labels_split2,
    test_size=0.2,
    random_state=42
)
X_train3, X_test3, y_train3, y_test3 = train_test_split(
    data_split3,
    labels_split3,
    test_size=0.2,
    random_state=42
)

# Combine the individual training/testing into a final split
X_train = np.concatenate((make_square(X_train1), make_square(X_train2), make_square(X_train3)))
X_test = np.concatenate((make_square(X_test1), make_square(X_test2), make_square(X_test3)))
y_train = np.concatenate((y_train1, y_train2, y_train3))
y_test = np.concatenate((y_test1, y_test2, y_test3))

# Encode the labels
y_train = to_categorical(y_train, num_classes=3)
y_test = to_categorical(y_test, num_classes=3)

# Create the CNN model
model = Sequential()

# Convolutional layers
model.add(Input((256, 256, 1)))
model.add(Conv2D(32, (3, 3), activation='relu'))
model.add(MaxPooling2D((2, 2)))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D((2, 2)))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dense(3, activation='softmax'))

model.compile(optimizer=Adam(), loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# Fit the model
n_epochs = 50
history = model.fit(X_train, y_train, epochs=n_epochs, batch_size=32, validation_data=(X_test, y_test))

# Predict labels for the testing data to show metrics and plots
y_pred = model.predict(X_test)

accuracy = accuracy_score(np.argmax(y_test, axis=1), np.argmax(y_pred, axis=1))
precision = precision_score(np.argmax(y_test, axis=1), np.argmax(y_pred, axis=1), average='weighted')
f1 = f1_score(np.argmax(y_test, axis=1), np.argmax(y_pred, axis=1), average='weighted')

print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"F1 Score: {f1:.4f}")

# Accuracy and Loss in training and validation (testing)
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend(['Train', 'Test'], loc='upper left')
plt.show()

plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.ylim(0,1)
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend(['Train', 'Test'], loc='upper left')
plt.show()

# Confusion matrix
conf_matrix = confusion_matrix(np.argmax(y_test, axis=1), np.argmax(y_pred, axis=1))
labels = ['Sagittal', 'Coronal', 'Axial']
plt.figure(figsize=(8, 6))
sns.heatmap(conf_matrix, annot=True, cmap='Blues', fmt='d', xticklabels=labels, yticklabels=labels)
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
plt.show()

# Save the trained model
joblib.dump(model, 'viewpoint_classifier.joblib')