#!/usr/bin/env python
# coding: utf-8

# In[46]:


def statDesc(filePath, fileName, newPath):
    import pandas as pd
    import numpy as np
    import pywt
    np.set_printoptions(precision=3)
    input_file = filePath+'/'+fileName
    df = pd.read_csv(input_file, sep='\t')
    desired_rows = 1281
    if (df.shape[0]<desired_rows):
        repetitions = int(desired_rows / len(df)) + 1
        df = pd.concat([df] * repetitions, ignore_index=True)[:desired_rows]
    Ene=[]
    for column in df.columns:
        data = df[column].values
        fft_values = np.fft.fft(data)
        frequencies = np.fft.fftfreq(len(data), 1 / 256)
        band_indices = np.where((frequencies >= 1) & (frequencies <= 4))
        absolute_power = np.sum(np.abs(fft_values[band_indices]) ** 2)
        Ene.append(absolute_power)
        band_indices = np.where((frequencies >= 4) & (frequencies <= 8))
        absolute_power = np.sum(np.abs(fft_values[band_indices]) ** 2)
        Ene.append(absolute_power)
        band_indices = np.where((frequencies >= 8) & (frequencies <= 12))
        absolute_power = np.sum(np.abs(fft_values[band_indices]) ** 2)
        Ene.append(absolute_power)
        band_indices = np.where((frequencies >= 13) & (frequencies <= 24))
        absolute_power = np.sum(np.abs(fft_values[band_indices]) ** 2)
        Ene.append(absolute_power)
        band_indices = np.where((frequencies >= 25) & (frequencies <= 65))
        absolute_power = np.sum(np.abs(fft_values[band_indices]) ** 2)
        Ene.append(absolute_power)
    file= newPath+'/'+fileName.split(".")[0]+'_'+'PowerBand'+'.txt'
    np.savetxt(file, Ene, fmt=(f'%.5e'))
import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
statDesc(filePath,fileName, newPath)

