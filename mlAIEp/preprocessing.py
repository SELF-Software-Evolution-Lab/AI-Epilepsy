import joblib
import nibabel as nib
import numpy as np
import os
import pandas as pd
from skimage.feature import hog
from sklearn.decomposition import PCA

# Find FLAIR files with size (160,256,256) for each participant in the dataset
search_str='FLAIR.'
size=(160, 256, 256)

# Images data
mri_data = []

# Original Labels
lobe_labels = []
hem_labels = []

# Extracted FLAIR files that meet size criteria
flair_files = []

data_dir = './Datos/'

# Read metadata to extract labels
metadata = pd.read_csv(data_dir + 'participants.tsv', delimiter='\t')
metadata_dict = {row['participant_id'][:9]: (row['lobe'], row['hemisphere']) for _, row in metadata.iterrows()}

# Iterate over the dataset according to the BIDS file structure 
for subject_dir in os.listdir(data_dir):
    subject_path = os.path.join(data_dir, subject_dir, 'anat')
    if os.path.isdir(subject_path):
        for mri_file in os.listdir(subject_path):
            if mri_file.endswith('.nii.gz') and (search_str in mri_file):
                mri_path = os.path.join(subject_path, mri_file)
                img = nib.load(mri_path)
                f_data = img.get_fdata()
                if f_data.shape == size:
                    mri_data.append(f_data)
                    lobe, hem = metadata_dict.get(mri_file[:9], ('nan', 'nan'))

                    # Encode labels to numbers
                    # Lobe {'FL':0, 'Other": 1, 'No lesion':2}
                    lobe = 0 if lobe == 'FL' else (1 if str(lobe) != 'nan' else 2)
                    # Hemisphere {'L':0, 'R": 1, 'No lesion':2}
                    hem = 0 if hem == 'L' else (1 if hem == 'R' else 2)

                    hem_labels.append(hem)
                    lobe_labels.append(lobe)
                    flair_files.append(subject_path)

mri_data = np.array(mri_data)
np.save('mri_data.npy', mri_data)

# Repeat labels to have one label per image and not per participant
# {0: Sagittal, 1: Coronal, 2: Axial}
lobe_reshaped_0 = np.repeat(lobe_labels, 160)
hem_reshaped_0 = np.repeat(hem_labels, 160)
lobe_reshaped_1 = np.repeat(lobe_labels, 256)
hem_reshaped_1 = np.repeat(hem_labels, 256)
lobe_reshaped_2 = np.repeat(lobe_labels, 256)
hem_reshaped_2 = np.repeat(hem_labels, 256)

# ROI analysis to assess labels. Relabel when the ROI doesn't show lesion on an image
search_str='FLAIR_roi'
roi_files = []
for subject_dir in os.listdir(data_dir):
    subject_path = os.path.join(data_dir, subject_dir, 'anat')
    if os.path.isdir(subject_path):
        for mri_file in os.listdir(subject_path):
            if mri_file.endswith('.nii.gz') and (search_str in mri_file):
                mri_path = os.path.join(subject_path, mri_file)
                img = nib.load(mri_path)
                f_data = img.get_fdata()
                if f_data.shape == (160,256,256):
                    roi_files.append(subject_path)
                    index = flair_files.index(subject_path)
                    for item in range(f_data.shape[0]):
                        isBlack = np.all(f_data[item, :, :] == 0)
                        if isBlack:
                            lobe_reshaped_0[(index * 160) + item] = 2
                            hem_reshaped_0[(index * 160) + item] = 2
                    for item in range(f_data.shape[1]):
                        isBlack = np.all(f_data[:, item, :] == 0)
                        if isBlack:
                            lobe_reshaped_1[(index * 256) + item] = 2
                            hem_reshaped_1[(index * 256) + item] = 2
                    for item in range(f_data.shape[2]):
                        isBlack = np.all(f_data[:, :, item] == 0)
                        if isBlack:
                            lobe_reshaped_2[(index * 256) + item] = 2
                            hem_reshaped_2[(index * 256) + item] = 2

# Save labels to import later in training
np.save('lobe_labels_original.npy', lobe_reshaped_0)
np.save('hem_labels_original.npy', hem_reshaped_0)
np.save('lobe_labels_sag.npy', lobe_reshaped_0)
np.save('hem_labels_sag.npy', hem_reshaped_0)
np.save('lobe_labels_cor.npy', lobe_reshaped_0)
np.save('hem_labels_cor.npy', hem_reshaped_0)
np.save('lobe_labels_ax.npy', lobe_reshaped_0)
np.save('hem_labels_ax.npy', hem_reshaped_0)

# Feature Extraction process:
# Histogram of Oriented Gradients (HOG)
def extract_hog_features(data, fixed_dim):
    features = []
    for subject in data:
        item_features = []
        for item in range(subject.shape[fixed_dim]):
            img = []
            if fixed_dim == 0:
                img = subject[item, :, :]
            elif fixed_dim == 1:
                img = subject[:, item, :]
            else:
                img = subject[:, :, item]
            hog_feat = hog(img, orientations=20, pixels_per_cell=(16, 16), cells_per_block=(4, 4), block_norm='L2-Hys', visualize=False)
            item_features.append(hog_feat)
        features.append(item_features)
    return np.array(features)

features_0 = extract_hog_features(mri_data, 0)
features_1 = extract_hog_features(mri_data, 1)
features_2 = extract_hog_features(mri_data, 2)

# Flatten the features
def reshape_features(features):
    num_items, num_images_per_item, num_features = features.shape
    return features.reshape(num_items * num_images_per_item, num_features)

features_0 = reshape_features(features_0)
features_1 = reshape_features(features_1)
features_2 = reshape_features(features_2)

# Principal Component Analysis (PCA)
pca = PCA(n_components=1890)
features_0 = pca.fit_transform(features_0)
joblib.dump(pca, 'pca_model_sag.joblib')
np.save('features_sag.npy', features_0)

pca = PCA(n_components=116)
features_1 = pca.fit_transform(features_1)
joblib.dump(pca, 'pca_model_cor.joblib')
np.save('features_cor.npy', features_1)

pca = PCA(n_components=121)
features_2 = pca.fit_transform(features_2)
joblib.dump(pca, 'pca_model_ax.joblib')
np.save('features_ax.npy', features_2)
