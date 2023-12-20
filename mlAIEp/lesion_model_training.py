import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, f1_score
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.multioutput import MultiOutputClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
import xgboost as xgb

# Utilities
def plot_confusion_matrix(confusion_hemisphere, confusion_lobe):
    class_labels_hemisphere = ["Left", "Right", "None"]
    class_labels_lobe = ["FL", "Other", "None"]
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(confusion_hemisphere, annot=True, fmt='d', cmap='Blues', xticklabels=class_labels_hemisphere, yticklabels=class_labels_hemisphere)
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix for Hemisphere')
    plt.show()
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(confusion_lobe, annot=True, fmt='d', cmap='Blues', xticklabels=class_labels_lobe, yticklabels=class_labels_lobe)
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix for Lobe')
    plt.show()

def print_metrics(y_pred, y_hemisphere_test, y_lobe_test):
    accuracy_hemisphere = accuracy_score(y_hemisphere_test, y_pred[:, 0])
    precision_hemisphere = precision_score(y_hemisphere_test, y_pred[:, 0], average='weighted')
    f1_score_hemisphere = f1_score(y_hemisphere_test, y_pred[:, 0], average='weighted')
    
    accuracy_lobe = accuracy_score(y_lobe_test, y_pred[:, 1])
    precision_lobe = precision_score(y_lobe_test, y_pred[:, 1], average='weighted')
    f1_score_lobe = f1_score(y_lobe_test, y_pred[:, 1], average='weighted')
    
    # Create a table using Pandas
    data = {
        'Metric': ['Accuracy', 'Precision', 'F1 Score'],
        'Hemisphere': [accuracy_hemisphere, precision_hemisphere, f1_score_hemisphere],
        'Lobe': [accuracy_lobe, precision_lobe, f1_score_lobe]
    }
    
    metrics_table = pd.DataFrame(data)
    print(metrics_table)

def multi_output_accuracy_scorer(estimator, X, y):
    y_pred = estimator.predict(X)
    num_outputs = y.shape[1]
    accuracies = [accuracy_score(y[:, i], y_pred[:, i]) for i in range(num_outputs)]
    average_accuracy = sum(accuracies) / num_outputs
    return average_accuracy

# Load labels and features
model_name = 'cor' # ['sag','cor','ax']
lobe_labels = np.load(f'lobe_labels_{model_name}.npy')
hemisphere_labels = np.load(f'hem_labels_{model_name}.npy')
features = np.load(f'features_{model_name}.npy')

# Undersample the biggest class based on lobe labels (No lesion)
undersampling = 20 if model_name == 'sag' else 40
indices_none = [i for i, label in enumerate(lobe_labels) if label == 2]
indices_others = [i for i, label in enumerate(lobe_labels) if label != 2]
np.random.seed(42)
np.random.shuffle(indices_none)
indices_none = indices_none[:len(indices_none)//undersampling]
indices = indices_none + indices_others

# Split the dataset {train: 80%, test: 20%}
X_train, X_test, y_hemisphere_train, y_hemisphere_test, y_lobe_train, y_lobe_test = train_test_split(
    features[indices],
    hemisphere_labels[indices],
    lobe_labels[indices],
    test_size=0.2,
    random_state=42
)

# Reshape and combine labels
y_hemisphere_train = y_hemisphere_train.reshape(-1, 1)
y_lobe_train = y_lobe_train.reshape(-1, 1)
y_train = np.hstack((y_hemisphere_train, y_lobe_train))

y_hemisphere_test = y_hemisphere_test.reshape(-1, 1)
y_lobe_test = y_lobe_test.reshape(-1, 1)
y_test = np.hstack((y_hemisphere_test, y_lobe_test))

# Cross Validation process
# Support Vector Machine (SVM) hyperparameter tuning
svm_param_grid = {
    'estimator__C': [0.1, 1.0, 10.0, 100, 1000],
    'estimator__kernel': ['linear', 'rbf'],
    'estimator__gamma': ['scale', 'auto', 0.01, 0.1, 1.0],
}

svm_grid = GridSearchCV(
    MultiOutputClassifier(SVC(), n_jobs=-1),
    svm_param_grid,
    scoring=multi_output_accuracy_scorer,
    cv=5,
    n_jobs=-1,
    verbose=2
)
svm_grid.fit(X_train, y_train)

print("SVM Best Parameters:", svm_grid.best_params_)
print("SVM Best Score:", svm_grid.best_score_)

# XGBoost hyperparameter tuning
xgb_param_grid = {
    'estimator__max_depth': [3, 4, 5, 7, 10],
    'estimator__n_estimators': [100, 200, 300],
    'estimator__learning_rate': [0.5, 0.3, 0.1],
}

xgb_grid = GridSearchCV(
    MultiOutputClassifier(xgb.XGBClassifier(), n_jobs=-1),
    xgb_param_grid,
    scoring=multi_output_accuracy_scorer,
    cv=5,
    n_jobs=-1,
    verbose=2 
)
xgb_grid.fit(X_train, y_train)

print("XGBoost Best Parameters:", xgb_grid.best_params_)
print("XGBoost Best Score:", xgb_grid.best_score_)

# k-Nearest Neighbors (KNN) hyperparameter tuning
knn_param_grid = {
    'estimator__n_neighbors': [3, 5, 7, 9, 11],
    'estimator__weights': ['uniform', 'distance'],
    'estimator__p': [1, 2],
}

knn_grid = GridSearchCV(
    MultiOutputClassifier(KNeighborsClassifier(), n_jobs=-1),
    knn_param_grid,
    scoring=multi_output_accuracy_scorer,
    cv=5,
    n_jobs=-1,
    verbose=2
)
knn_grid.fit(X_train, y_train)

print("KNN Best Parameters:", knn_grid.best_params_)
print("KNN Best Score:", knn_grid.best_score_)

# Example code to run one model with determined parameters
# model = MultiOutputClassifier(estimator=SVC(C=10, gamma='scale', kernel="rbf", probability=True), n_jobs=-1)
# model.fit(X_train, y_train)
# print('Score:',model.score(X_test, y_test))

# y_pred = model.predict(X_test)

# confusion_matrix_hemisphere = confusion_matrix(y_hemisphere_test, y_pred[:, 0])
# confusion_matrix_lobe = confusion_matrix(y_lobe_test, y_pred[:, 1])
# plot_confusion_matrix(confusion_matrix_hemisphere, confusion_matrix_lobe)

# print_metrics(y_pred, y_hemisphere_test, y_lobe_test)

# joblib.dump(multi_classifier_svm, f'classifier_{model_name}.joblib')