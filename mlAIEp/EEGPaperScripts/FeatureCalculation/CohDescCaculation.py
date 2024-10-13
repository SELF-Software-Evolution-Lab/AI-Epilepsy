#!/usr/bin/env python
# coding: utf-8

# In[46]:


def statDesc(filePath, fileName, newPath):
    import pandas as pd
    import numpy as np
    import pywt
    from scipy.signal import welch, coherence
    np.set_printoptions(precision=3)
    input_file = filePath+'/'+fileName
    df = pd.read_csv(input_file, sep='\t')
    desired_rows = 1281
    if (df.shape[0]<desired_rows):
        repetitions = int(desired_rows / len(df)) + 1
        df = pd.concat([df] * repetitions, ignore_index=True)[:desired_rows]
    num_channels = len(df.columns)
    coherence_matrix = np.zeros((num_channels, num_channels))
    for i in range(num_channels):
        for j in range(i + 1, num_channels):
            _, coh = coherence(df.iloc[:, i], df.iloc[:, j], fs=256)
            mean_coh = np.mean(coh) 
            coherence_matrix[i, j] = mean_coh
            coherence_matrix[j, i] = mean_coh
    matrix = np.multiply(coherence_matrix, 1000)
    nested_list = matrix.tolist()
    concatenated_list = []
    [concatenated_list.extend(row) for row in nested_list]
    Flist = [x for x in concatenated_list if x != 0]
    file= newPath+'/'+fileName.split(".")[0]+'_'+'Coh'+'.txt'
    np.savetxt(file, Flist, fmt=(f'%.5e'))
import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
statDesc(filePath,fileName, newPath)

