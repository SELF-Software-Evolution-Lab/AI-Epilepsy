#!/usr/bin/env python
# coding: utf-8

# In[1]:
import sys

def processAnnotation(AnnotationFilePath,AnnotFile, FileName):
    import pandas as pd
    import numpy as np
    df = pd.read_csv(AnnotationFilePath+'/'+AnnotFile, header=None)
    df = df[df.iloc[:, 0] == FileName]
    df = df.drop(df.columns[0], axis=1)
    array = df.to_numpy()
    array= array[~np.isnan(array)]
    return array


# In[2]:


def processEEG(EEGFilePath, FileName, DataBase):
    import mne
    import numpy as np
    data = mne.io.read_raw_edf(EEGFilePath+'/'+FileName+'.edf', preload=True)
    lowpass_cutoff = 0.5
    highpass_cutoff = 70
    final_data=[]
    if DataBase=='AUB' or DataBase=='NICU':
        notch_frequency = 50
        raw_filtered = data.copy()
        raw_filtered.filter(lowpass_cutoff, highpass_cutoff, fir_design='firwin')
        raw_filtered.notch_filter(notch_frequency, fir_design='firwin')
        # NICU 1 'ref' NIcu 2 'REF
        Fp1F7=(raw_filtered.copy().pick_channels(['EEG Fp1-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG F7-Ref']).get_data()[0])
        mean = np.mean(Fp1F7)
        std_dev = np.std(Fp1F7)
        Fp1F7 = (Fp1F7 - mean) / std_dev
        final_data.append(Fp1F7)
        
        F7T3=(raw_filtered.copy().pick_channels(['EEG F7-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG T3-Ref']).get_data()[0])
        mean = np.mean(F7T3)
        std_dev = np.std(F7T3)
        F7T3 = (F7T3 - mean) / std_dev
        final_data.append(F7T3)
        
        T3T5=(raw_filtered.copy().pick_channels(['EEG T3-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG T5-Ref']).get_data()[0])
        mean = np.mean(T3T5)
        std_dev = np.std(T3T5)
        T3T5 = (T3T5 - mean) / std_dev
        final_data.append(T3T5)
        
        T5O1=(raw_filtered.copy().pick_channels(['EEG T5-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG O1-Ref']).get_data()[0])
        mean = np.mean(T5O1)
        std_dev = np.std(T5O1)
        T5O1 = (T5O1 - mean) / std_dev
        final_data.append(T5O1)
        
        Fp2F8=(raw_filtered.copy().pick_channels(['EEG Fp2-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG F8-Ref']).get_data()[0])
        mean = np.mean(Fp2F8)
        std_dev = np.std(Fp2F8)
        Fp2F8 = (Fp2F8 - mean) / std_dev
        final_data.append(Fp2F8)
        
        F8T4=(raw_filtered.copy().pick_channels(['EEG F8-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG T4-Ref']).get_data()[0])
        mean = np.mean(F8T4)
        std_dev = np.std(F8T4)
        F8T4 = (F8T4 - mean) / std_dev
        final_data.append(F8T4)
        
        T4T6=(raw_filtered.copy().pick_channels(['EEG T4-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG T6-Ref']).get_data()[0])
        mean = np.mean(T4T6)
        std_dev = np.std(T4T6)
        T4T6 = (T4T6 - mean) / std_dev
        final_data.append(T4T6)
        
        T6O2=(raw_filtered.copy().pick_channels(['EEG T6-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG O2-Ref']).get_data()[0])
        mean = np.mean(T6O2)
        std_dev = np.std(T6O2)
        T6O2 = (T6O2 - mean) / std_dev
        final_data.append(T6O2)
        
        Fp1F3=(raw_filtered.copy().pick_channels(['EEG Fp1-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG F3-Ref']).get_data()[0])
        mean = np.mean(Fp1F3)
        std_dev = np.std(Fp1F3)
        Fp1F3 = (Fp1F3 - mean) / std_dev
        final_data.append(Fp1F3)
        
        F3C3=(raw_filtered.copy().pick_channels(['EEG F3-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG C3-Ref']).get_data()[0])
        mean = np.mean(F3C3)
        std_dev = np.std(F3C3)
        F3C3 = (F3C3 - mean) / std_dev
        final_data.append(F3C3)
        
        C3P3=(raw_filtered.copy().pick_channels(['EEG C3-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG P3-Ref']).get_data()[0])
        mean = np.mean(C3P3)
        std_dev = np.std(C3P3)
        C3P3 = (C3P3 - mean) / std_dev
        final_data.append(C3P3)
        
        P3O1=(raw_filtered.copy().pick_channels(['EEG P3-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG O1-Ref']).get_data()[0])
        mean = np.mean(P3O1)
        std_dev = np.std(P3O1)
        P3O1 = (P3O1 - mean) / std_dev
        final_data.append(P3O1)
        
        Fp2F4=(raw_filtered.copy().pick_channels(['EEG Fp2-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG F4-Ref']).get_data()[0])
        mean = np.mean(Fp2F4)
        std_dev = np.std(Fp2F4)
        Fp2F4 = (Fp2F4 - mean) / std_dev
        final_data.append(Fp2F4)
        
        F4C4=(raw_filtered.copy().pick_channels(['EEG F4-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG C4-Ref']).get_data()[0])
        mean = np.mean(F4C4)
        std_dev = np.std(F4C4)
        F4C4 = (F4C4 - mean) / std_dev
        final_data.append(F4C4)
        
        C4P4=(raw_filtered.copy().pick_channels(['EEG C4-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG P4-Ref']).get_data()[0])
        mean = np.mean(C4P4)
        std_dev = np.std(C4P4)
        C4P4 = (C4P4 - mean) / std_dev
        final_data.append(C4P4)
        
        P4O2=(raw_filtered.copy().pick_channels(['EEG P4-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG O2-Ref']).get_data()[0])
        mean = np.mean(P4O2)
        std_dev = np.std(P4O2)
        P4O2 = (P4O2 - mean) / std_dev
        final_data.append(P4O2)
        
        FzCz=(raw_filtered.copy().pick_channels(['EEG Fz-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG Cz-Ref']).get_data()[0])
        mean = np.mean(FzCz)
        std_dev = np.std(FzCz)
        FzCz = (FzCz - mean) / std_dev
        final_data.append(FzCz)
        
        CzPz=(raw_filtered.copy().pick_channels(['EEG Cz-Ref']).get_data()[0])-(raw_filtered.copy().pick_channels(['EEG Pz-Ref']).get_data()[0])
        mean = np.mean(CzPz)
        std_dev = np.std(CzPz)
        CzPz = (CzPz - mean) / std_dev
        final_data.append(CzPz)

        if DataBase=='AUB':
            sampleFrequency=500
        else:
            sampleFrequency=256            
    elif DataBase=='CHBMIT':
        notch_frequency = 60
        raw_filtered = data.copy()
        raw_filtered.filter(lowpass_cutoff, highpass_cutoff, fir_design='firwin')
        raw_filtered.notch_filter(notch_frequency, fir_design='firwin')
        
        Fp1F7=(raw_filtered.copy().pick_channels(['FP1-F7']).get_data()[0])
        mean = np.mean(Fp1F7)
        std_dev = np.std(Fp1F7)
        Fp1F7 = (Fp1F7 - mean) / std_dev
        final_data.append(Fp1F7)
        
        F7T3=(raw_filtered.copy().pick_channels(['F7-T7']).get_data()[0])
        mean = np.mean(F7T3)
        std_dev = np.std(F7T3)
        F7T3 = (F7T3 - mean) / std_dev
        final_data.append(F7T3)
        
        T3T5=(raw_filtered.copy().pick_channels(['T7-P7']).get_data()[0])
        mean = np.mean(T3T5)
        std_dev = np.std(T3T5)
        T3T5 = (T3T5 - mean) / std_dev
        final_data.append(T3T5)
        
        T5O1=(raw_filtered.copy().pick_channels(['P7-O1']).get_data()[0])
        mean = np.mean(T5O1)
        std_dev = np.std(T5O1)
        T5O1 = (T5O1 - mean) / std_dev
        final_data.append(T5O1)
        
        Fp2F8=(raw_filtered.copy().pick_channels(['FP2-F8']).get_data()[0])
        mean = np.mean(Fp2F8)
        std_dev = np.std(Fp2F8)
        Fp2F8 = (Fp2F8 - mean) / std_dev
        final_data.append(Fp2F8)
        
        F8T4=(raw_filtered.copy().pick_channels(['F8-T8']).get_data()[0])
        mean = np.mean(F8T4)
        std_dev = np.std(F8T4)
        F8T4 = (F8T4 - mean) / std_dev
        final_data.append(F8T4)
        
        T4T6=(raw_filtered.copy().pick_channels(['T8-P8-0']).get_data()[0]) # CHBMIT 2,4 y 5:  'T8-P8-0' 1 y 3 'T8-P8'
        mean = np.mean(T4T6)
        std_dev = np.std(T4T6)
        T4T6 = (T4T6 - mean) / std_dev
        final_data.append(T4T6)
        
        T6O2=(raw_filtered.copy().pick_channels(['P8-O2']).get_data()[0])
        mean = np.mean(T6O2)
        std_dev = np.std(T6O2)
        T6O2 = (T6O2 - mean) / std_dev
        final_data.append(T6O2)
        
        Fp1F3=(raw_filtered.copy().pick_channels(['FP1-F3']).get_data()[0])
        mean = np.mean(Fp1F3)
        std_dev = np.std(Fp1F3)
        Fp1F3 = (Fp1F3 - mean) / std_dev
        final_data.append(Fp1F3)
        
        F3C3=(raw_filtered.copy().pick_channels(['F3-C3']).get_data()[0])
        mean = np.mean(F3C3)
        std_dev = np.std(F3C3)
        F3C3 = (F3C3 - mean) / std_dev
        final_data.append(F3C3)
        
        C3P3=(raw_filtered.copy().pick_channels(['C3-P3']).get_data()[0])
        mean = np.mean(C3P3)
        std_dev = np.std(C3P3)
        C3P3 = (C3P3 - mean) / std_dev
        final_data.append(C3P3)
        
        P3O1=(raw_filtered.copy().pick_channels(['P3-O1']).get_data()[0])
        mean = np.mean(P3O1)
        std_dev = np.std(P3O1)
        P3O1 = (P3O1 - mean) / std_dev
        final_data.append(P3O1)
        
        Fp2F4=(raw_filtered.copy().pick_channels(['FP2-F4']).get_data()[0])
        mean = np.mean(Fp2F4)
        std_dev = np.std(Fp2F4)
        Fp2F4 = (Fp2F4 - mean) / std_dev
        final_data.append(Fp2F4)
        
        F4C4=(raw_filtered.copy().pick_channels(['F4-C4']).get_data()[0])
        mean = np.mean(F4C4)
        std_dev = np.std(F4C4)
        F4C4 = (F4C4 - mean) / std_dev
        final_data.append(F4C4)
        
        C4P4=(raw_filtered.copy().pick_channels(['C4-P4']).get_data()[0])
        mean = np.mean(C4P4)
        std_dev = np.std(C4P4)
        C4P4 = (C4P4 - mean) / std_dev
        final_data.append(C4P4)
        
        P4O2=(raw_filtered.copy().pick_channels(['P4-O2']).get_data()[0])
        mean = np.mean(P4O2)
        std_dev = np.std(P4O2)
        P4O2 = (P4O2 - mean) / std_dev
        final_data.append(P4O2)
        
        FzCz=(raw_filtered.copy().pick_channels(['FZ-CZ']).get_data()[0])
        mean = np.mean(FzCz)
        std_dev = np.std(FzCz)
        FzCz = (FzCz - mean) / std_dev
        final_data.append(FzCz)
        
        CzPz=(raw_filtered.copy().pick_channels(['CZ-PZ']).get_data()[0])
        mean = np.mean(CzPz)
        std_dev = np.std(CzPz)
        CzPz = (CzPz - mean) / std_dev
        final_data.append(CzPz)

        sampleFrequency=256
    return final_data, sampleFrequency 


# In[3]:

def print_dict_to_txt(data_dict, file_name):
    with open(file_name, 'w') as file:
        # Write column headers
        headers = list(data_dict.keys())
        file.write('\t'.join(headers))
        file.write('\n')
        
        # Write values for each column
        num_rows = max(len(v) for v in data_dict.values())
        for i in range(num_rows):
            row_values = [str("{:.6g}".format(data_dict[key][i])) if i < len(data_dict[key]) else '' for key in headers]
            file.write('\t'.join(row_values))
            file.write('\n')

def dataDivision(final_data, array, sampleFrequency, file_name, path_Seizure, path_Seizure_Free):
    import numpy as np
    from scipy import signal
    import math
    InicioSeizure=0
    np.set_printoptions(threshold=np.inf)
    A=0
    FreqSampleo = 256
    resamplingRatio = FreqSampleo / sampleFrequency    
    sizes=[]
    if array[0] != 0:
        sizes.append(array[1]*sampleFrequency)
    else:
        InicioSeizure=1
    for q in range(2, array.size):
        sizes.append((array[q]-array[q-1])*sampleFrequency)
    sizes.append(((np.shape(final_data)[1]/sampleFrequency)-array[-1])*sampleFrequency)
    Names=['Fp1-F7', 'P7-T3', 'T3-T5', 'T5-O1', 'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2', 'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1', 'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2', 'Fz-Cz', 'Cz-Pz']
    for s in range(0, len(sizes)):
        sizes[s] = int(sizes[s])
    arrayy = np.array(final_data, ndmin=2)
    sub = np.hsplit(arrayy, np.cumsum(sizes)[:-1])
    subsets=[]
    for e in range (0, len(sub)):
        subsets.append(sub[e])
    for i in range(0, len(subsets)):
        rank=subsets[i]
        for j in range(0, int(rank[i].size), int(5*sampleFrequency)):
            info={}
            for k in range (0,len(Names)):
                channel=rank[k]
                subset = channel[j:j+(5*sampleFrequency)]
                resamplingL= int(len(subset) * resamplingRatio)
                resampledSubset = signal.resample(subset, resamplingL)
                #info.append(Names[k])
                #info.append(resampledSubset)
                info[Names[k]] = resampledSubset
            if InicioSeizure==0:
                if (i+1)%2 == 0:
                    file= path_Seizure+'/'+file_name+'_'+str(A)+'.txt'
                    print_dict_to_txt(info, file)
                    #with open(path_Seizure+'/'+file_name+'_'+str(A)+'.txt', 'w') as file:
                     #   for f in range(0, len(info), 2):
                      #      row = " ".join(str(item) for item in info[f:f+2])
                       #     file.write(row + '\n')  
                else:
                    file= path_Seizure_Free+'/'+file_name+'_'+str(A)+'.txt'
                    print_dict_to_txt(info, file)
                    #with open(path_Seizure_Free+'/'+file_name+'_'+str(A)+'.txt', 'w') as file:
                     #   for f in range(0, len(info), 2):
                      #      row = " ".join(str(item) for item in info[f:f+2])
                       #     file.write(row + '\n') 
            else:
                if (i+1)%2== 0:
                    file= path_Seizure+'/'+file_name+'_'+str(A)+'.txt'
                    print_dict_to_txt(info, file)
                    #with open(path_Seizure_Free+'/'+file_name+'_'+str(A)+'.txt', 'w') as file:
                     #   for f in range(0, len(info), 2):
                      #      row = " ".join(str(item) for item in info[f:f+2])
                       #     file.write(row + '\n')  
                else:
                    file= path_Seizure_Free+'/'+file_name+'_'+str(A)+'.txt'
                    print_dict_to_txt(info, file)
                    #with open(path_Seizure+'/'+file_name+'_'+str(A)+'.txt', 'w') as file:
                     #   for f in range(0, len(info), 2):
                      #      row = " ".join(str(item) for item in info[f:f+2])
                       #     file.write(row + '\n')
            A=A+1


# In[4]:


AnnotationFilePath = sys.argv[1]
AnnotFile = sys.argv[2]
EEGFilePath = sys.argv[3]
FileName = sys.argv[4]
DataBase = sys.argv[5]
path_Seizure = sys.argv[6]
path_Seizure_Free = sys.argv[7]


# In[5]:


Arreglo=processAnnotation(AnnotationFilePath,AnnotFile, FileName)
[Data, sampleFrequency]=processEEG(EEGFilePath, FileName, DataBase)
sizes=dataDivision(Data, Arreglo, sampleFrequency, FileName, path_Seizure, path_Seizure_Free)

