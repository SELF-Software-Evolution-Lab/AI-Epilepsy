#!/usr/bin/env python
# coding: utf-8

# In[46]:


def statDesc(filePath, fileName, newPath):
    import pandas as pd
    import numpy as np
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
            transform = np.fft.fft(data)
            power_spectrum = np.abs(transform) ** 2
            energy = np.sum(power_spectrum)
            Ene.append(energy)
    file= newPath+'/'+fileName.split(".")[0]+'_'+'FouTEnergy'+'.txt'
    np.savetxt(file, Ene, fmt=(f'%.5e'))
import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
statDesc(filePath,fileName, newPath)

