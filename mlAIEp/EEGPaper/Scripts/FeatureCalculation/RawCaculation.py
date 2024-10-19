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
    List=df.values.flatten().tolist()
    file= newPath+'/'+fileName.split(".")[0]+'_'+'Raw'+'.txt'
    np.savetxt(file, List, fmt=(f'%.5e'))
import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
statDesc(filePath,fileName, newPath)

