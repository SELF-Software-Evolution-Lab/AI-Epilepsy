#!/usr/bin/env python
# coding: utf-8

# In[46]:


def statDesc(filePath, fileName, newPath):
    import pandas as pd
    import numpy as np
    from scipy.stats import skew, kurtosis
    np.set_printoptions(precision=3)
    input_file = filePath+'/'+fileName
    df = pd.read_csv(input_file, sep='\t')
    desired_rows = 1281
    if (df.shape[0]<desired_rows):
        repetitions = int(desired_rows / len(df)) + 1
        df = pd.concat([df] * repetitions, ignore_index=True)[:desired_rows]
    means=[]
    medians=[]
    var=[]
    std=[]
    skewn=[]
    kurt=[]
    for column in df.columns:
        data = df[column].values
        mean = np.mean(np.power(data, 2))
        median = np.median(np.power(data, 2))
        variance = np.var(data)
        std_deviation = np.std(data)
        skewness = skew(data)
        kurtos = kurtosis(data)
        means.append(mean)
        medians.append(median)
        var.append(variance)
        std.append(std_deviation)
        skewn.append(skewness*1000)
        kurt.append(kurtos*1000)
    StatDesc= means+medians+var+std+skewn+kurt
    file= newPath+'/'+fileName.split(".")[0]+'_'+'StatDesc'+'.txt'
    np.savetxt(file, StatDesc, fmt=(f'%.5e'))
import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
statDesc(filePath,fileName, newPath)

