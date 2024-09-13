# Machine Learning module

This module contains the python scripts used throughout the machine learning development to preprocess the data, train the models and create a prediction pipeline.

The main goal from this module is to predict lesion localization regarding lobe and hemisphere based on MRIs.

The dataset used for this project can be accessed from [OpenNeuro](https://openneuro.org/datasets/ds004199/versions/1.0.5)*.

For EEG-based algorithms, we can resort to [The Siena EEG dataset](https://physionet.org/content/siena-scalp-eeg/1.0.0/PN05/#files-panel) for verification and [The MIT EEG dataset](https://physionet.org/content/chbmit/1.0.0/) for training such algorithms. Verification of such algorithms can be done through the eeg-verification notebook.

| File                          | Content                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| preprocessing.py              | Initial data load including labels<br />Relabeling using ROI annotation from the dataset<br />Feature extraction: HOG and PCA<br />Export labels, features and PCA models                                                                                                                                                                                   |
| lesion_model_training.py      | Import viewpoint specific labels and features<br />Split data into training and testing<br />Cross validation process<br />Example model creation and export                                                                                                                                                                                                 |
| viewpoint_model_training.py** | Import original images<br />Create labels for Sagittal, Coronal, and Axial viewpoints<br />Split data intro training and testing<br />Create and fit CNN model<br />Export model                                                                                                                                                                            |
| pipeline_utilities.py         | Functions used to build the pipelines<br />Includes image loading and preprocessing                                                                                                                                                                                                                                                                          |
| pipeline_creation.py          | Import PCA and Classifier models<br />Build each pipeline workflow<br />Export pipelines                                                                                                                                                                                                                                                                     |
| prediction_pipeline.py        | Import individual pipelines (Sagittal, Coronal, Axial, and Viewpoint classification)<br />Predict lesions for all dicom files inside a zip given by a path<br />The result follows the structure defined in [this file](https://github.com/SELF-Software-Evolution-Lab/AI-Epilepsy/blob/6aef6a666aecac0669770035d63b31091f546b23/bkAIEp/doc/mri_results.json)) |

You can set up the system requirements on a Debian-based machine by running the command:

```
sudo bash prepare_installation.sh
```

You can get the EEG dataset via the following command:

```
wget -r -N -c -np https://physionet.org/files/siena-scalp-eeg/1.0.0/
```

To install the required dependencies run `pip install -r requirements.txt`

To run the preprocessing script you must download the dataset and place it inside a folder that can be specified in the variable `data_dir`.

The pipeline files stored in the `mlAIEp > pipelines` are managed by Git LFS due to their large size.

** If you are going to run the viewpoint_model_training.py you may need to follow the instructions on Tensorflow's [website](https://www.tensorflow.org/install/pip) to install tensorflow on your specific OS.

*Fabiane Schuch and Lennart Walger and Matthias Schmitz and Bastian David and Tobias Bauer and Antonia Harms and Laura Fischbach and Freya Schulte and Martin Schidlowski and Johannes Reiter and Felix Bitzer and Randi von Wrede and Attila Rácz and Tobias Baumgartner and Valeri Borger and Matthias Schneider and Achim Flender and Albert Becker and Hartmut Vatter and Bernd Weber and Louisa Specht-Riemenschneider and Alexander Radbruch and Rainer Surges and Theodor Rüber (2023). An open presurgery MRI dataset of people with epilepsy and focal cortical dysplasia type II. OpenNeuro. [Dataset] doi: doi:10.18112/openneuro.ds004199.v1.0.5
