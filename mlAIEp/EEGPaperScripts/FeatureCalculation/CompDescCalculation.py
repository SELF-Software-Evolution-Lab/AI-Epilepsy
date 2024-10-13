#!/usr/bin/env python
# coding: utf-8

# In[46]:


def Comp_Desc(filePath, fileName, newPath, filePathA, filePathB):
    import pandas as pd
    import numpy as np
    import os
    np.set_printoptions(precision=3)
    input_file = filePath+'/'+fileName
    df = pd.read_csv(input_file, sep='\t')
    desired_rows = 1281
    if (df.shape[0]<desired_rows):
        repetitions = int(desired_rows / len(df)) + 1
        df = pd.concat([df] * repetitions, ignore_index=True)[:desired_rows]
    files_list=associated_files(fileName, filePathA, filePathB)
    dictio={}
    for element in files_list:
        if os.path.exists(filePathA+'/'+element):
            path=filePathA
        elif os.path.exists(filePathB+'/'+element):
            path=filePathB
        og_file = path+'/'+element
        df1 = pd.read_csv(og_file, sep='\t')
        desired_rows = 1281
        if (df1.shape[0]<desired_rows):
            repetitions = int(desired_rows / len(df1)) + 1
            df1 = pd.concat([df1] * repetitions, ignore_index=True)[:desired_rows]
        for column_name in df.columns:
            s1=df[column_name].values
            s2=df1[column_name].values
            Compa=Comp(s1, s2)
            if column_name in dictio.keys():
                dictio[column_name].append(Compa)
            else:
                dictio[column_name]=[Compa]
    means=[]
    medians=[]
    var=[]
    std=[]
    maxi=[]
    mini=[]
    for key in dictio:
        listica = np.array(dictio[key])
        mean = np.mean(listica)
        median = np.median(listica)
        variance = np.var(listica)
        std_deviation = np.std(listica)
        maxim=np.max(listica)
        minim=np.min(np.where(listica == 0, np.inf, listica))
        means.append(mean)
        medians.append(median)
        var.append(variance)
        std.append(std_deviation)
        maxi.append(maxim)
        mini.append(minim)
    FinDesc= means+medians+var+maxi+mini
    file= newPath+'/'+fileName.split(".")[0]+'_'+'Comp'+'.txt'
    np.savetxt(file, FinDesc, fmt=(f'%.5e'))

def associated_files(fileName, filePathA, filePathB):
    import os
    import random
    split_parts = fileName.split('_')[:-1]
    prefix = '_'.join(split_parts)
    file_list = []
    for fil in os.listdir(filePathA):
        if fil.startswith(prefix):
            file_list.append(fil)
    for fil in os.listdir(filePathB):
        if fil.startswith(prefix):
            file_list.append(fil)
    file_list = sorted(file_list)
    random_list = random.sample(file_list, 50)
    return random_list

def Comp(s1, s2):
    import numpy as np
    rms1 = np.sqrt(np.mean(s1**2))
    rms2 = np.sqrt(np.mean(s2**2))
    comp=(np.abs(rms1-rms2))
    return comp

import sys
filePath = sys.argv[1]
fileName = sys.argv[2]
newPath = sys.argv[3]
filePathA= sys.argv[4]
filePathB= sys.argv[5]

Comp_Desc(filePath,fileName, newPath, filePathA, filePathB)


