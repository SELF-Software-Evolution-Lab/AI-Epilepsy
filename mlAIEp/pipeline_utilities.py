import cv2
from enum import Enum
import numpy as np
import os
import pydicom
import re
from skimage.feature import hog
import zipfile

class HemisphereEnum(Enum):
    L = 0
    R = 1
    NONE = 2
class LobeEnum(Enum):
    FL = 0
    OTHER = 1
    NONE = 2
class ViewpointEnum(Enum):
    SAG = 0
    COR = 1
    AX = 2

def get_hog_features(images):
    hog_features = []
    for image in images:
        features = hog(image, orientations=20, pixels_per_cell=(16, 16), cells_per_block=(4, 4), visualize=False, block_norm='L2-Hys')
        hog_features.append(features)
    return np.array(hog_features)

def add_padding(image, desired_aspect_ratio):
    height, width = image.shape[:2]

    current_aspect_ratio = width / height
    if current_aspect_ratio < desired_aspect_ratio:
        new_width = int(height * desired_aspect_ratio)
        pad = (new_width - width) // 2
        padded_image = cv2.copyMakeBorder(image, 0, 0, pad, pad, cv2.BORDER_CONSTANT, value=(0, 0, 0))
    else:
        new_height = int(width / desired_aspect_ratio)
        pad = (new_height - height) // 2
        padded_image = cv2.copyMakeBorder(image, pad, pad, 0, 0, cv2.BORDER_CONSTANT, value=(0, 0, 0))

    return padded_image

def image_processor(images, desired_height=160, desired_width=256):
    processed_images = []
    for image in images:
        rotated_image = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)

        original_height, original_width = rotated_image.shape[:2]
        aspect_ratio = original_width / original_height
        desired_ratio = desired_width / desired_height

        if aspect_ratio == 1:
            rotated_image = add_padding(rotated_image, 0.75)
            original_height, original_width = rotated_image.shape[:2]
            aspect_ratio = original_width / original_height            

        if aspect_ratio > desired_ratio:
            new_height = desired_height
            new_width = int(new_height * aspect_ratio)
        else:
            new_width = desired_width
            new_height = int(new_width / aspect_ratio)

        resized_image = cv2.resize(rotated_image, (new_width, new_height))

        start_x = max(new_width // 2 - desired_width // 2, 0)
        start_y = max(new_height // 2 - desired_height // 2, 0)
        cropped_image = resized_image[start_y:start_y + desired_height, start_x:start_x + desired_width]

        processed_images.append(cropped_image)

    return np.array(processed_images)

def image_square(images, size=256):
    processed_images = []
    for image in images:
        height, width = image.shape[:2]

        larger_side = max(height, width)
    
        vertical_padding = (larger_side - height) // 2
        horizontal_padding = (larger_side - width) // 2
    
        square_image = np.zeros((larger_side, larger_side), dtype=np.uint8)

        square_image[vertical_padding:vertical_padding+height, horizontal_padding:horizontal_padding+width] = image
    
        square_image_resized = cv2.resize(square_image, (size, size))
        processed_images.append(cv2.rotate(square_image_resized, cv2.ROTATE_90_CLOCKWISE))
    
    return np.array(processed_images)

def load_dicom(file_path):
    extraction_path = file_path[:-3]
    ids = re.findall(r'user-(\d+).*exam-(\d+)', file_path)
    
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        zip_ref.extractall(extraction_path)

    extraction_path = f'{extraction_path}/{ids[0][0]}/{ids[0][1]}'
    file_path = os.listdir(extraction_path)

    input_data = []
    files = []
    for folder in file_path:
        for file in os.listdir(f'{extraction_path}/{folder}'):
            if file.endswith('.dcm'):
                input_data.append(pydicom.dcmread(f'{extraction_path}/{folder}/{file}').pixel_array)
                files.append(file)
    
    return files, input_data