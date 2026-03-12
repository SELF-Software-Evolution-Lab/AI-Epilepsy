# Scripts

* DLModels: Scripts for the trainig and testing of Deep Learning models.
* MLModels: Scripts for the trainig and testing of classical machine Learning models
* Feature Calculation: Scripts for 8 subsets of features extracted from EEG for later classical machine learning models training.
* Others: Contains script for data preprocessing, ROC curve calculation and dependencies used for all scripts.
* TrainData: Data to train ML models
* -> WaveletsFeature: NoSeizureWave.txt SeizureWave.txt
* -> All Features: NoSeizureAll.txt SeizureAll.txt

###  Run ML Training
Script in MLModels directory

`python3 modelsML.py SeizureFile SeizureFile name`

* SeizureFile: .txt file with features from 5s windows labeled with seizure presence. Examples in TrainData directory.
* NoSeizureFile: .txt file with features from 5s windows labeled seizure-free. Examples in TrainData directory.
* Name: String. Prefix to identify output files from script. ex: "Wavelets"

