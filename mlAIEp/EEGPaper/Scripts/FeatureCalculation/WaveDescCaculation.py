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
    wavelets =['db4', 'morl', 'sym4']
    levels=[4, 5, 8]
    for column in df.columns:
        for wavelet in wavelets:
            for lev in levels:
                data = df[column].values
                if wavelet=='morl':
                    scales = np.arange(1, 10)
                    coeffs, frequencies = pywt.cwt(data, scales, wavelet)
                else:
                    coeffs = pywt.wavedec(data, wavelet, level=lev)
                coeffs_energy = [np.sum(np.abs(c) ** 2) for c in coeffs]
                Ene.append(coeffs_energy)
    EneF=[]
    for sublist in Ene:
        EneF += sublist
    for i in range(len(EneF)):
        EneF[i] *= 1000
    file= newPath+'/'+fileName.split(".")[0]+'_'+'WaveDesc'+'.txt'
    np.savetxt(file, EneF, fmt=(f'%.5e'))
import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
statDesc(filePath,fileName, newPath)

