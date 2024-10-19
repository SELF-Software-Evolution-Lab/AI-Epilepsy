#!/usr/bin/env python
# coding: utf-8

# In[46]:


def statDesc(filePath, fileName, newPath):
    import pandas as pd
    import numpy as np
    import pywt
    from scipy.stats import entropy
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
        squared_signal = np.square(data)
        energy = np.sum(squared_signal)
        Ene.append(energy)
        value_counts = np.bincount(np.absolute(data.astype(int)))
        probabilities = value_counts / len(data)
        signal_entropy = entropy(probabilities, base=2)
        Ene.append(signal_entropy)
        activity = np.var(data)
        mobility = np.var(np.diff(data))
        complexity = mobility / np.sqrt(activity)
        Ene.append(activity)
        Ene.append(mobility)
        Ene.append(complexity)
    file= newPath+'/'+fileName.split(".")[0]+'_'+'TimeDomain'+'.txt'
    np.savetxt(file, Ene, fmt=(f'%.5e'))
import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
statDesc(filePath,fileName, newPath)



