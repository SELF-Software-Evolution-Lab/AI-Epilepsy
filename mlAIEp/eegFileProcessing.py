import zipfile
import os
import numpy as np
import joblib
import pandas as pd
import mne
import sys
import pywt
from sklearn.preprocessing import StandardScaler

# Input: zip file with multiple .edf files
# Output: Dictionary where keys are the EDF file name. 
def analyzeEEGFile(zip_file):
    result={}
    with zipfile.ZipFile(zip_file, 'r') as zip_ref:
        zip_ref.extractall("extracted_files")
        for filename in zip_ref.namelist():
            file_path = os.path.join("extracted_files", filename)
            if os.path.isfile(file_path):
                filename2 = os.path.basename(filename)
                print("Starting prediction for "+file_path)
                filePrediction = filePredict(file_path)
                print("Finished prediction for "+file_path)
                result[filename2] = encodeEEGAnswer(filePrediction,5)
    return result
    
#Output: List of 0s and 1s.
# Each item on the list represents 5 seconds of the exam from the edf file. 
# The list is organized chronologically, meaning the first element represents time from 0s to 5s. Second one, from 5s to 10s and so on.
# 1 means that the 5 second fragment is from a seizure and 0 that is seizure-free
def filePredict(file_path):
    data = eegArray(file_path)
    prediction = eegResult(data)
    return prediction

def eegArray(extracted_file_path):
    final_data=[]
    data = mne.io.read_raw_edf(extracted_file_path, preload=True)
    lowpass_cutoff = 0.5
    highpass_cutoff = 70
    notch_frequency = 60
    raw_filtered = data.copy()
    raw_filtered.filter(lowpass_cutoff, highpass_cutoff, fir_design='firwin')
    raw_filtered.notch_filter(notch_frequency, fir_design='firwin')
    print(raw_filtered.ch_names)
    #Names=['Fp1-F7', 'P7-T3', 'T3-T5', 'T5-O1', 'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2', 'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1', 'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2', 'Fz-Cz', 'Cz-Pz']
    Fp1F7=(raw_filtered.copy().pick_channels(['FP1-F7']).get_data()[0])
    final_data.append(Fp1F7)
    F7T3=(raw_filtered.copy().pick_channels(['F7-T7']).get_data()[0])
    final_data.append(F7T3)
    T3T5=(raw_filtered.copy().pick_channels(['T7-P7']).get_data()[0])
    final_data.append(T3T5)
    T5O1=(raw_filtered.copy().pick_channels(['P7-O1']).get_data()[0])
    final_data.append(T5O1)
    Fp2F8=(raw_filtered.copy().pick_channels(['FP2-F8']).get_data()[0])
    final_data.append(Fp2F8)
    F8T4=(raw_filtered.copy().pick_channels(['F8-T8']).get_data()[0])
    final_data.append(F8T4)
    T4T6=(raw_filtered.copy().pick_channels(['T8-P8-0']).get_data()[0])
    final_data.append(T4T6)
    T6O2=(raw_filtered.copy().pick_channels(['P8-O2']).get_data()[0])
    final_data.append(T6O2)
    Fp1F3=(raw_filtered.copy().pick_channels(['FP1-F3']).get_data()[0])
    final_data.append(Fp1F3)
    F3C3=(raw_filtered.copy().pick_channels(['F3-C3']).get_data()[0])
    final_data.append(F3C3)
    C3P3=(raw_filtered.copy().pick_channels(['C3-P3']).get_data()[0])
    final_data.append(C3P3)
    P3O1=(raw_filtered.copy().pick_channels(['P3-O1']).get_data()[0])
    final_data.append(P3O1)
    Fp2F4=(raw_filtered.copy().pick_channels(['FP2-F4']).get_data()[0])
    final_data.append(Fp2F4)
    F4C4=(raw_filtered.copy().pick_channels(['F4-C4']).get_data()[0])
    final_data.append(F4C4)
    C4P4=(raw_filtered.copy().pick_channels(['C4-P4']).get_data()[0])
    final_data.append(C4P4)
    P4O2=(raw_filtered.copy().pick_channels(['P4-O2']).get_data()[0])
    final_data.append(P4O2)
    FzCz=(raw_filtered.copy().pick_channels(['FZ-CZ']).get_data()[0])
    final_data.append(FzCz)
    CzPz=(raw_filtered.copy().pick_channels(['CZ-PZ']).get_data()[0])
    final_data.append(CzPz)
    return final_data
    
def eegResult(Array):
    print ("Starting prediction")
    print (type(Array))
    prediction = []
    freq_sampling = 256
    seconds = 5
    window_size = freq_sampling*seconds
    array = np.array(Array, ndmin=2)
    channels = array.shape[0]
    windows = (array.size/(window_size*channels)) // 1
    print (windows)
    columns = int(windows*window_size)
    for j in range(0, columns, window_size):
        subset = array[:,j:j+window_size]
        #zeros = np.zeros((subset.shape[0],1))
        #subsetF = np.hstack((subset, zeros))
        subsetF = subset
        feature = featureCalculation(subsetF)
        pred = eegPrediciton(feature)
        prediction.append(pred[0])
    return prediction

def featureCalculation(window_data):
    df = pd.DataFrame(window_data)
    df = df.T
    desired_rows = 1206
    #print (df.shape)
    #print (len(df))
    if (df.shape[0]<desired_rows):
        repetitions = int(desired_rows / len(df)) + 1
        df = pd.concat([df] * repetitions, ignore_index=True)[:desired_rows]
    Ene=[]
    wavelets =['db4', 'morl', 'sym4']
    levels=[4, 5, 8]
    for column in df.columns:
        for wavelet in wavelets:
            for lev in levels:
                data = df[column].values
                #print(len(data))
                if wavelet=='morl':
                    scales = np.arange(1, 10)
                    coeffs, frequencies = pywt.cwt(data, scales, wavelet)
                else:
                    coeffs = pywt.wavedec(data, wavelet, level=lev)
                coeffs_energy = [np.sum(np.abs(c) ** 2) for c in coeffs]
                #print(len(coeffs_energy))
                Ene.append(coeffs_energy)
    EneF=[]
    for sublist in Ene:
        EneF += sublist
    for i in range(len(EneF)):
        EneF[i] *= 1000
    #print(len(EneF))
    return EneF
    
def eegPrediciton(feature):
    print("Predicting")
    print (len(feature))
    current_dir = os.getcwd()
    pipelinesLocation=os.path.join(current_dir)
    scaler_path=os.path.join(current_dir, 'WaveRFC_Scaler.pkl')     # Model Location
    sc=joblib.load(scaler_path)
    model_path=os.path.join(current_dir, 'WaveRFC_Model.pkl')     # Model Location
    model=joblib.load(model_path)
    value=pd.DataFrame(feature)
    value=value.T
    value = sc.transform(value)
    pred = model.predict(value) 
    print (pred)
    return pred
       
def encodeEEGAnswer(window_pred, window_size):
    answer = ""
    start = -1
    end = -1
    for i in range(len(window_pred)):
        if window_pred[i] == 1 :
            if start==-1 :
                start = window_size*i
            end = window_size*i
        else:
            if start!=-1 :
                answer+=","+start+","+end
            start = -1
    if start!=-1:
        answer+=","+start+","+end
    return answer

edfFile = sys.argv[1]
result = filePredict (edfFile)
print(result)
