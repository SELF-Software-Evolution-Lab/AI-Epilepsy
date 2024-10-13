#!/usr/bin/env python
# coding: utf-8


def ROC(FeaturePath, ScalerPathML, ModelPathML, ScalerPathDL, ModelPathDL, name):
    import joblib
    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from keras.models import load_model
    import numpy as np
    import numpy as np
    import matplotlib.pyplot as plt
    from sklearn.metrics import roc_curve, auc, precision_recall_curve, average_precision_score

    df_SeizureAll = pd.read_csv(FeaturePath+'/SeizureAll.txt', header=None, sep='\t')
    df_NoSeizureAll = pd.read_csv(FeaturePath+'/NoSeizureAll.txt', header=None, sep='\t')
    df_SeizureAll = df_SeizureAll.drop(0, inplace=False, axis=1)
    df_NoSeizureAll = df_NoSeizureAll.drop(0, inplace=False, axis=1)
    df_SeizureAll = df_SeizureAll.T
    df_NoSeizureAll = df_NoSeizureAll.T
    df_SeizureAll = df_SeizureAll.dropna()
    df_NoSeizureAll = df_NoSeizureAll.dropna()
    rowsZeroSAll = df_SeizureAll[df_SeizureAll.eq(0).all(axis=1)]
    rowsZeroNSAll = df_NoSeizureAll[df_NoSeizureAll.eq(0).all(axis=1)]
    df_SeizureAll = df_SeizureAll.drop(rowsZeroSAll.index)
    df_NoSeizureAll = df_NoSeizureAll.drop(rowsZeroNSAll.index)
    df_SeizureAll['Label'] = 1
    df_NoSeizureAll['Label'] = 0
    dfAll = pd.concat([df_NoSeizureAll, df_SeizureAll], ignore_index=True)
    yAll = dfAll['Label']
    XAll= dfAll.drop('Label', inplace=False, axis=1)
    X_trainAll, X_testAll, y_trainAll, y_testAll = train_test_split(XAll, yAll, test_size=0.1, random_state=2)

    # df_SeizureWave = pd.read_csv(FeaturePath+'/SeizureWave.txt', header=None, sep='\t')
    # df_NoSeizureWave = pd.read_csv(FeaturePath+'/NoSeizureWave.txt', header=None, sep='\t')
    # df_SeizureWave = df_SeizureWave.drop(0, inplace=False, axis=1)
    # df_NoSeizureWave = df_NoSeizureWave.drop(0, inplace=False, axis=1)
    # df_SeizureWave = df_SeizureWave.T
    # df_NoSeizureWave = df_NoSeizureWave.T
    # df_SeizureWave = df_SeizureWave.dropna()
    # df_NoSeizureWave = df_NoSeizureWave.dropna()
    # rowsZeroSWave = df_SeizureWave[df_SeizureWave.eq(0).all(axis=1)]
    # rowsZeroNSWave = df_NoSeizureWave[df_NoSeizureWave.eq(0).all(axis=1)]
    # df_SeizureWave = df_SeizureWave.drop(rowsZeroSWave.index)
    # df_NoSeizureWave = df_NoSeizureWave.drop(rowsZeroNSWave.index)
    # df_SeizureWave['Label'] = 1
    # df_NoSeizureWave['Label'] = 0
    # dfWave = pd.concat([df_NoSeizureWave, df_SeizureWave], ignore_index=True)
    # yWave = dfWave['Label']
    # XWave = dfWave.drop('Label', inplace=False, axis=1)
    # X_trainWave, X_testWave, y_trainWave, y_testWave = train_test_split(XWave, yWave, test_size=0.1, random_state=2)
# 
    # df_SeizureCoh = pd.read_csv(FeaturePath+'/SeizureCoh.txt', header=None, sep='\t')
    # df_NoSeizureCoh = pd.read_csv(FeaturePath+'/NoSeizureCoh.txt', header=None, sep='\t')
    # df_SeizureCoh = df_SeizureCoh.drop(0, inplace=False, axis=1)
    # df_NoSeizureCoh = df_NoSeizureCoh.drop(0, inplace=False, axis=1)
    # df_SeizureCoh = df_SeizureCoh.T
    # df_NoSeizureCoh = df_NoSeizureCoh.T
    # df_SeizureCoh = df_SeizureCoh.dropna()
    # df_NoSeizureCoh = df_NoSeizureCoh.dropna()
    # rowsZeroSCoh = df_SeizureCoh[df_SeizureCoh.eq(0).all(axis=1)]
    # rowsZeroNSCoh = df_NoSeizureCoh[df_NoSeizureCoh.eq(0).all(axis=1)]
    # df_SeizureCoh = df_SeizureCoh.drop(rowsZeroSCoh.index)
    # df_NoSeizureCoh = df_NoSeizureCoh.drop(rowsZeroNSCoh.index)
    # df_SeizureCoh['Label'] = 1
    # df_NoSeizureCoh['Label'] = 0
    # dfCoh = pd.concat([df_NoSeizureCoh, df_SeizureCoh], ignore_index=True)
    # yCoh = dfCoh['Label']
    # XCoh = dfCoh.drop('Label', inplace=False, axis=1)
    # X_trainCoh, X_testCoh, y_trainCoh, y_testCoh = train_test_split(XCoh, yCoh, test_size=0.1, random_state=2)
# 
    # df_SeizureCompA = pd.read_csv(FeaturePath+'/SeizureCompA.txt', header=None, sep='\t')
    # df_NoSeizureCompA = pd.read_csv(FeaturePath+'/NoSeizureCompA.txt', header=None, sep='\t')
    # df_SeizureCompA = df_SeizureCompA.drop(0, inplace=False, axis=1)
    # df_NoSeizureCompA = df_NoSeizureCompA.drop(0, inplace=False, axis=1)
    # df_SeizureCompA = df_SeizureCompA.T
    # df_NoSeizureCompA = df_NoSeizureCompA.T
    # df_SeizureCompA = df_SeizureCompA.dropna()
    # df_NoSeizureCompA = df_NoSeizureCompA.dropna()
    # rowsZeroSCompA = df_SeizureCompA[df_SeizureCompA.eq(0).all(axis=1)]
    # rowsZeroNSCompA = df_NoSeizureCompA[df_NoSeizureCompA.eq(0).all(axis=1)]
    # df_SeizureCompA = df_SeizureCompA.drop(rowsZeroSCompA.index)
    # df_NoSeizureCompA = df_NoSeizureCompA.drop(rowsZeroNSCompA.index)
    # df_SeizureCompA['Label'] = 1
    # df_NoSeizureCompA['Label'] = 0
    # dfCompA = pd.concat([df_NoSeizureCompA, df_SeizureCompA], ignore_index=True)
    # yCompA = dfCompA['Label']
    # XCompA = dfCompA.drop('Label', inplace=False, axis=1)
    # X_trainCompA, X_testCompA, y_trainCompA, y_testCompA = train_test_split(XCompA, yCompA, test_size=0.1, random_state=2)
# 
    # df_SeizureCompF = pd.read_csv(FeaturePath+'/SeizureCompF.txt', header=None, sep='\t')
    # df_NoSeizureCompF = pd.read_csv(FeaturePath+'/NoSeizureCompF.txt', header=None, sep='\t')
    # df_SeizureCompF = df_SeizureCompF.drop(0, inplace=False, axis=1)
    # df_NoSeizureCompF = df_NoSeizureCompF.drop(0, inplace=False, axis=1)
    # df_SeizureCompF = df_SeizureCompF.T
    # df_NoSeizureCompF = df_NoSeizureCompF.T
    # df_SeizureCompF = df_SeizureCompF.dropna() 
    # df_NoSeizureCompF = df_NoSeizureCompF.dropna()
    # rowsZeroSCompF = df_SeizureCompF[df_SeizureCompF.eq(0).all(axis=1)]
    # rowsZeroNSCompF = df_NoSeizureCompF[df_NoSeizureCompF.eq(0).all(axis=1)]
    # df_SeizureCompF = df_SeizureCompF.drop(rowsZeroSCompF.index)
    # df_NoSeizureCompF = df_NoSeizureCompF.drop(rowsZeroNSCompF.index)
    # df_SeizureCompF['Label'] = 1
    # df_NoSeizureCompF['Label'] = 0
    # dfCompF = pd.concat([df_NoSeizureCompF, df_SeizureCompF], ignore_index=True)
    # yCompF = dfCompF['Label']
    # XCompF = dfCompF.drop('Label', inplace=False, axis=1)
    # X_trainCompF, X_testCompF, y_trainCompF, y_testCompF = train_test_split(XCompF, yCompF, test_size=0.1, random_state=2)
# 
    # df_SeizureFouTE = pd.read_csv(FeaturePath+'/SeizureFouTE.txt', header=None, sep='\t')
    # df_NoSeizureFouTE = pd.read_csv(FeaturePath+'/NoSeizureFouTE.txt', header=None, sep='\t')
    # df_SeizureFouTE = df_SeizureFouTE.drop(0, inplace=False, axis=1)
    # df_NoSeizureFouTE = df_NoSeizureFouTE.drop(0, inplace=False, axis=1)
    # df_SeizureFouTE = df_SeizureFouTE.T
    # df_NoSeizureFouTE = df_NoSeizureFouTE.T
    # df_SeizureFouTE = df_SeizureFouTE.dropna()
    # df_NoSeizureFouTE = df_NoSeizureFouTE.dropna()
    # rowsZeroSFouTE = df_SeizureFouTE[df_SeizureFouTE.eq(0).all(axis=1)]
    # rowsZeroNSFouTE = df_NoSeizureFouTE[df_NoSeizureFouTE.eq(0).all(axis=1)]
    # df_SeizureFouTE = df_SeizureFouTE.drop(rowsZeroSFouTE.index)
    # df_NoSeizureFouTE = df_NoSeizureFouTE.drop(rowsZeroNSFouTE.index)
    # df_SeizureFouTE['Label'] = 1
    # df_NoSeizureFouTE['Label'] = 0
    # dfFouTE = pd.concat([df_NoSeizureFouTE, df_SeizureFouTE], ignore_index=True)
    # yFouTE = dfFouTE['Label']
    # XFouTE = dfFouTE.drop('Label', inplace=False, axis=1)
    # X_trainFouTE, X_testFouTE, y_trainFouTE, y_testFouTE = train_test_split(XFouTE, yFouTE, test_size=0.1, random_state=2)
# 
    # df_SeizurePBand = pd.read_csv(FeaturePath+'/SeizurePBand.txt', header=None, sep='\t')
    # df_NoSeizurePBand = pd.read_csv(FeaturePath+'/NoSeizurePBand.txt', header=None, sep='\t')
    # df_SeizurePBand = df_SeizurePBand.drop(0, inplace=False, axis=1)
    # df_NoSeizurePBand = df_NoSeizurePBand.drop(0, inplace=False, axis=1)
    # df_SeizurePBand = df_SeizurePBand.T
    # df_NoSeizurePBand = df_NoSeizurePBand.T
    # df_SeizurePBand = df_SeizurePBand.dropna()
    # df_NoSeizurePBand = df_NoSeizurePBand.dropna()
    # rowsZeroSPBand = df_SeizurePBand[df_SeizurePBand.eq(0).all(axis=1)]
    # rowsZeroNSPBand = df_NoSeizurePBand[df_NoSeizurePBand.eq(0).all(axis=1)]
    # df_SeizurePBand = df_SeizurePBand.drop(rowsZeroSPBand.index)
    # df_NoSeizurePBand = df_NoSeizurePBand.drop(rowsZeroNSPBand.index)
    # df_SeizurePBand['Label'] = 1
    # df_NoSeizurePBand['Label'] = 0
    # dfPBand = pd.concat([df_NoSeizurePBand, df_SeizurePBand], ignore_index=True)
    # yPBand = dfPBand['Label']
    # XPBand = dfPBand.drop('Label', inplace=False, axis=1)
    # X_trainPBand, X_testPBand, y_trainPBand, y_testPBand = train_test_split(XPBand, yPBand, test_size=0.1, random_state=2)
# # 
    # df_SeizureStats = pd.read_csv(FeaturePath+'/SeizureStats.txt', header=None, sep='\t')
    # df_NoSeizureStats = pd.read_csv(FeaturePath+'/NoSeizureStats.txt', header=None, sep='\t')
    # df_SeizureStats = df_SeizureStats.drop(0, inplace=False, axis=1)
    # df_NoSeizureStats = df_NoSeizureStats.drop(0, inplace=False, axis=1)
    # df_SeizureStats = df_SeizureStats.T
    # df_NoSeizureStats = df_NoSeizureStats.T
    # df_SeizureStats = df_SeizureStats.dropna()
    # df_NoSeizureStats = df_NoSeizureStats.dropna()
    # rowsZeroSStats = df_SeizureStats[df_SeizureStats.eq(0).all(axis=1)]
    # rowsZeroNSStats = df_NoSeizureStats[df_NoSeizureStats.eq(0).all(axis=1)]
    # df_SeizureStats = df_SeizureStats.drop(rowsZeroSStats.index)
    # df_NoSeizureStats = df_NoSeizureStats.drop(rowsZeroNSStats.index)
    # df_SeizureStats['Label'] = 1
    # df_NoSeizureStats['Label'] = 0
    # dfStats = pd.concat([df_NoSeizureStats, df_SeizureStats], ignore_index=True)
    # yStats = dfStats['Label']
    # XStats = dfStats.drop('Label', inplace=False, axis=1)
    # X_trainStats, X_testStats, y_trainStats, y_testStats = train_test_split(XStats, yStats, test_size=0.1, random_state=2)
# 
    # df_SeizureTimeD = pd.read_csv(FeaturePath+'/SeizureTimeD.txt', header=None, sep='\t')
    # df_NoSeizureTimeD = pd.read_csv(FeaturePath+'/NoSeizureTimeD.txt', header=None, sep='\t')
    # df_SeizureTimeD = df_SeizureTimeD.drop(0, inplace=False, axis=1)
    # df_NoSeizureTimeD = df_NoSeizureTimeD.drop(0, inplace=False, axis=1)
    # df_SeizureTimeD = df_SeizureTimeD.T
    # df_NoSeizureTimeD = df_NoSeizureTimeD.T
    # df_SeizureTimeD = df_SeizureTimeD.dropna()
    # df_NoSeizureTimeD = df_NoSeizureTimeD.dropna()
    # rowsZeroSTimeD = df_SeizureTimeD[df_SeizureTimeD.eq(0).all(axis=1)]
    # rowsZeroNSTimeD = df_NoSeizureTimeD[df_NoSeizureTimeD.eq(0).all(axis=1)]
    # df_SeizureTimeD = df_SeizureTimeD.drop(rowsZeroSTimeD.index)
    # df_NoSeizureTimeD = df_NoSeizureTimeD.drop(rowsZeroNSTimeD.index)
    # df_SeizureTimeD['Label'] = 1
    # df_NoSeizureTimeD['Label'] = 0
    # dfTimeD = pd.concat([df_NoSeizureTimeD, df_SeizureTimeD], ignore_index=True)
    # yTimeD = dfTimeD['Label']
    # XTimeD = dfTimeD.drop('Label', inplace=False, axis=1)
    # X_trainTimeD, X_testTimeD, y_trainTimeD, y_testTimeD = train_test_split(XTimeD, yTimeD, test_size=0.1, random_state=2)

    df_SeizureRaw = pd.read_csv(FeaturePath+'/SeizureRaw.txt', header=None, sep='\t')
    df_NoSeizureRaw = pd.read_csv(FeaturePath+'/NoSeizureRaw.txt', header=None, sep='\t')
    df_SeizureRaw = df_SeizureRaw.drop(0, inplace=False, axis=1)
    df_NoSeizureRaw = df_NoSeizureRaw.drop(0, inplace=False, axis=1)
    df_SeizureRaw = df_SeizureRaw.T
    df_NoSeizureRaw = df_NoSeizureRaw.T
    df_SeizureRaw = df_SeizureRaw.dropna()
    df_NoSeizureRaw = df_NoSeizureRaw.dropna()
    rowsZeroSRaw = df_SeizureRaw[df_SeizureRaw.eq(0).all(axis=1)]
    rowsZeroNSRaw = df_NoSeizureRaw[df_NoSeizureRaw.eq(0).all(axis=1)]
    df_SeizureRaw = df_SeizureRaw.drop(rowsZeroSRaw.index)
    df_NoSeizureRaw = df_NoSeizureRaw.drop(rowsZeroNSRaw.index)
    df_SeizureRaw['Label'] = 1
    df_NoSeizureRaw['Label'] = 0
    dfRaw = pd.concat([df_NoSeizureRaw, df_SeizureRaw], ignore_index=True)
    yRaw = dfRaw['Label']
    XRaw= dfRaw.drop('Label', inplace=False, axis=1)
    X_trainRaw, X_testRaw, y_trainRaw, y_testRaw = train_test_split(XRaw, yRaw, test_size=0.1, random_state=2)

    df_SeizureYang = pd.read_csv(FeaturePath+'/SeizureYang.txt', header=None, sep='\t')
    df_NoSeizureYang = pd.read_csv(FeaturePath+'/NoSeizureYang.txt', header=None, sep='\t')
    indexes=[500, 1780, 2900, 4100, 5300, 6500, 7700, 8900, 10100, 11300, 13500, 14700, 15900, 17100, 18300, 19500, 20700, 21900]
    df_SeizureYang = df_SeizureYang.drop(0, inplace=False, axis=1)
    df_NoSeizureYang = df_NoSeizureYang.drop(0, inplace=False, axis=1)
    for ix in indexes:
        df_SeizureYang = df_SeizureYang.drop(ix, inplace=False, axis=0)
        df_NoSeizureYang = df_NoSeizureYang.drop(ix, inplace=False, axis=0)
    df_SeizureYang = df_SeizureYang.T
    df_NoSeizureYang = df_NoSeizureYang.T
    df_SeizureYang = df_SeizureYang.dropna()
    df_NoSeizureYang = df_NoSeizureYang.dropna()
    rowsZeroS = df_SeizureYang[df_SeizureYang.eq(0).all(axis=1)]
    rowsZeroNS = df_NoSeizureYang[df_NoSeizureYang.eq(0).all(axis=1)]
    df_SeizureYang = df_SeizureYang.drop(rowsZeroS.index)
    df_NoSeizureYang = df_NoSeizureYang.drop(rowsZeroNS.index)
    df_SeizureYang['Label'] = 1
    df_NoSeizureYang['Label'] = 0
    dfYang = pd.concat([df_NoSeizureYang, df_SeizureYang], ignore_index=True)
    yYang = dfYang['Label']
    XYang= dfYang.drop('Label', inplace=False, axis=1)
    X_train1Yang, X_testYang, y_train1Yang, y_testYang = train_test_split(XYang, yYang, test_size=0.1, random_state=2)
    X_trainYang, X_valYang, y_trainYang, y_valYang = train_test_split(X_train1Yang, y_train1Yang, test_size=0.1, random_state=2)
    
    
    scalerAll = joblib.load(ScalerPathML+'/All_Scaler.pkl')
    # scalerWave = joblib.load(ScalerPathML+'/Wave_Scaler.pkl')
    # scalerCoh = joblib.load(ScalerPathML+'/Coh_Scaler.pkl')
    # scalerCompA = joblib.load(ScalerPathML+'/CompA_Scaler.pkl')
    # scalerCompF = joblib.load(ScalerPathML+'/CompF_Scaler.pkl')
    # scalerFouTE = joblib.load(ScalerPathML+'/FouTE_Scaler.pkl')
    # scalerPBand = joblib.load(ScalerPathML+'/PBand_Scaler.pkl')
    # scalerStats = joblib.load(ScalerPathML+'/Stats_Scaler.pkl')
    # scalerTimeD = joblib.load(ScalerPathML+'/TimeD_Scaler.pkl')
    scalerCNN1 = joblib.load(ScalerPathDL+'/CNN1Scaler.pkl')
    scalerCNN3 = joblib.load(ScalerPathDL+'/3CNN1Scaler.pkl')
    scalerDCNN = joblib.load(ScalerPathDL+'/DCNN1Scaler.pkl')
    scalerFCN = joblib.load(ScalerPathDL+'/FCN1Scaler.pkl')
    scalerAE = joblib.load(ScalerPathDL+'/AE1Scaler.pkl')
    scalerYang = joblib.load(ScalerPathDL+'/YangScaler.pkl')
    

    # modelSGD = joblib.load(ModelPathML+'/All_SGD_Model.pkl')
    # modelSVM = joblib.load(ModelPathML+'/All_SVM_Model.pkl')
    # modelDTC = joblib.load(ModelPathML+'/All_DTC_Model.pkl')
    # modelKNN = joblib.load(ModelPathML+'/All_KNN_Model.pkl')
    # modelNBC = joblib.load(ModelPathML+'/All_NBC_Model.pkl')
    # modelRFC = joblib.load(ModelPathML+'/All_RFC_Model.pkl')
    
    modelAll = joblib.load(ModelPathML+'/All_Grid_Model.pkl')
    # modelWave = joblib.load(ModelPathML+'/Wave_Grid_Model.pkl')
    # modelCoh = joblib.load(ModelPathML+'/Coh_Grid_Model.pkl')
    # modelCompA = joblib.load(ModelPathML+'/CompA_Grid_Model.pkl')
    # modelCompF = joblib.load(ModelPathML+'/CompF_Grid_Model.pkl')
    # modelFouTE = joblib.load(ModelPathML+'/FouTE_Grid_Model.pkl')
    # modelPBand = joblib.load(ModelPathML+'/PBand_Grid_Model.pkl')
    # modelStats = joblib.load(ModelPathML+'/Stats_Grid_Model.pkl')
    # modelTimeD = joblib.load(ModelPathML+'/TimeD_Grid_Model.pkl')
    
    modelCNN1 = load_model(ModelPathDL+'/CNN1.h5')
    modelCNN3 = load_model(ModelPathDL+'/3CNN1.h5')
    modelDCNN = load_model(ModelPathDL+'/DCNN1.h5')
    modelFCN = load_model(ModelPathDL+'/FCN1.h5')
    modelAE = load_model(ModelPathDL+'/AE1.h5')
    modelYang = load_model(ModelPathDL+'/Yang.h5')

    X_test_All_sc = scalerAll.transform(X_testAll)
    # X_test_Wave_sc = scalerWave.transform(X_testWave)
    # X_test_Coh_sc = scalerCoh.transform(X_testCoh)
    # X_test_CompA_sc = scalerCompA.transform(X_testCompA)
    # X_test_CompF_sc = scalerCompF.transform(X_testCompF)
    # X_test_FouTE_sc = scalerFouTE.transform(X_testFouTE)
    # X_test_PBand_sc = scalerPBand.transform(X_testPBand)
    # X_test_Stats_sc = scalerStats.transform(X_testStats)
    # X_test_TimeD_sc = scalerTimeD.transform(X_testTimeD)

    X_test_CNN1_sc = scalerCNN1.transform(X_testRaw)
    X_test_CNN3_sc = scalerCNN3.transform(X_testRaw)
    X_test_DCNN_sc = scalerDCNN.transform(X_testRaw)
    X_test_FCN_sc = scalerFCN.transform(X_testRaw)
    X_test_AE_sc = scalerAE.transform(X_testRaw)
    X_test_Yang_sc = scalerYang.transform(X_testYang)

    plt.figure(figsize=(16, 12))

    # y_scoreSGD = modelSGD.predict_proba(X_test_All_sc)[:, 1]
    # fprSGD, tprSGD, _ = roc_curve(y_testAll, y_scoreSGD)
    # roc_aucSGD = auc(fprSGD, tprSGD)
    # plt.plot(fprSGD, tprSGD, lw=4, label=f'SGD+All, ROC area = {roc_aucSGD:.5f})')
# 
    # y_scoreSVM = modelSVM.predict_proba(X_test_All_sc)[:, 1]
    # fprSVM, tprSVM, _ = roc_curve(y_testAll, y_scoreSVM)
    # roc_aucSVM = auc(fprSVM, tprSVM)
    # plt.plot(fprSVM, tprSVM, lw=4, label=f'SVM+All, ROC area = {roc_aucSVM:.5f})')
# 
    # y_scoreRFC = modelRFC.predict_proba(X_test_All_sc)[:, 1]
    # fprRFC, tprRFC, _ = roc_curve(y_testAll, y_scoreRFC)
    # roc_aucRFC = auc(fprRFC, tprRFC)
    # plt.plot(fprRFC, tprRFC, lw=4, label=f'RFC+All, ROC area = {roc_aucRFC:.5f})')
# 
    # y_scoreDTC = modelDTC.predict_proba(X_test_All_sc)[:, 1]
    # fprDTC, tprDTC, _ = roc_curve(y_testAll, y_scoreDTC)
    # roc_aucDTC = auc(fprDTC, tprDTC)
    # plt.plot(fprDTC, tprDTC, lw=4, label=f'DTC+All, ROC area = {roc_aucDTC:.5f})')
# 
    # y_scoreKNN = modelKNN.predict_proba(X_test_All_sc)[:, 1]
    # fprKNN, tprKNN, _ = roc_curve(y_testAll, y_scoreKNN)
    # roc_aucKNN = auc(fprKNN, tprKNN)
    # plt.plot(fprKNN, tprKNN, lw=4, label=f'KNN+All, ROC area = {roc_aucKNN:.5f})')
# 
    # y_scoreNBC = modelNBC.predict_proba(X_test_All_sc)[:, 1]
    # fprNBC, tprNBC, _ = roc_curve(y_testAll, y_scoreNBC)
    # roc_aucNBC = auc(fprNBC, tprNBC)
    # plt.plot(fprNBC, tprNBC, lw=4, label=f'NBC+All, ROC area = {roc_aucNBC:.5f})')

    y_scoreAll = modelAll.predict_proba(X_test_All_sc)[:, 1]
    fprAll, tprAll, _ = roc_curve(y_testAll, y_scoreAll)
    roc_aucAll = auc(fprAll, tprAll)
    plt.plot(fprAll, tprAll, lw=2, label=f'All, ROC area = {roc_aucAll:.5f})')

    # y_scoreWave = modelWave.predict_proba(X_test_Wave_sc)[:, 1]
    # fprWave, tprWave, _ = roc_curve(y_testWave, y_scoreWave)
    # roc_aucWave = auc(fprWave, tprWave)
    # plt.plot(fprWave, tprWave, lw=2, label=f'Wavelets, ROC area = {roc_aucWave:.5f})')
# 
    # y_scoreCoh = modelCoh.predict_proba(X_test_Coh_sc)[:, 1]
    # fprCoh, tprCoh, _ = roc_curve(y_testCoh, y_scoreCoh)
    # roc_aucCoh = auc(fprCoh, tprCoh)
    # plt.plot(fprCoh, tprCoh, lw=2, label=f'Coherence, ROC area = {roc_aucCoh:.5f})')
# 
    #y_scoreCompA = modelCompA.predict_proba(X_test_CompA_sc)[:, 1]
    #fprCompA, tprCompA, _ = roc_curve(y_testCompA, y_scoreCompA)
    #roc_aucCompA = auc(fprCompA, tprCompA)
#    plt.plot(fprCompA, tprCompA, lw=2, label=f'CompA, ROC area = {roc_aucCompA:.5f})')
# 
    # y_scoreCompF = modelCompF.predict_proba(X_test_CompF_sc)[:, 1]
    # fprCompF, tprCompF, _ = roc_curve(y_testCompF, y_scoreCompF)
    # roc_aucCompF = auc(fprCompF, tprCompF)
    # plt.plot(fprCompF, tprCompF, lw=2, label=f'CompF, ROC area = {roc_aucCompF:.5f})')
# 
    # y_scoreFouTE = modelFouTE.predict_proba(X_test_FouTE_sc)[:, 1]
    # fprFouTE, tprFouTE, _ = roc_curve(y_testFouTE, y_scoreFouTE)
    # roc_aucFouTE = auc(fprFouTE, tprFouTE)
    # plt.plot(fprFouTE, tprFouTE, lw=2, label=f'FouTE, ROC area = {roc_aucFouTE:.5f})')
# 
    # y_scorePBand = modelPBand.predict_proba(X_test_PBand_sc)[:, 1]
    # fprPBand, tprPBand, _ = roc_curve(y_testPBand, y_scorePBand)
    # roc_aucPBand = auc(fprPBand, tprPBand)
    # plt.plot(fprPBand, tprPBand, lw=2, label=f'PBand, ROC area = {roc_aucPBand:.5f})')
# 
    # y_scoreStats = modelStats.predict_proba(X_test_Stats_sc)[:, 1]
    # fprStats, tprStats, _ = roc_curve(y_testStats, y_scoreStats)
    # roc_aucStats = auc(fprStats, tprStats)
    # plt.plot(fprStats, tprStats, lw=2, label=f'Stats, ROC area = {roc_aucStats:.5f})')

    # y_scoreTimeD = modelTimeD.predict_proba(X_test_TimeD_sc)[:, 1]
    # fprTimeD, tprTimeD, _ = roc_curve(y_testTimeD, y_scoreTimeD)
    # roc_aucTimeD = auc(fprTimeD, tprTimeD)
    # plt.plot(fprTimeD, tprTimeD, lw=2, label=f'TimeD, ROC area = {roc_aucTimeD:.5f})')
        
    y_scoreCNN1 = modelCNN1.predict(X_test_CNN1_sc)[:, 1]
    fprCNN1, tprCNN1, thresholds = roc_curve(y_testRaw, y_scoreCNN1)
    roc_aucCNN1 = auc(fprCNN1, tprCNN1)
    plt.plot(fprCNN1, tprCNN1, lw=4, label=f'CNN1, ROC area = {roc_aucCNN1:.5f})')
    # 
    y_scoreCNN3 = modelCNN3.predict(X_test_CNN3_sc)[:, 1]
    fprCNN3, tprCNN3, thresholds = roc_curve(y_testRaw, y_scoreCNN3)
    roc_aucCNN3 = auc(fprCNN3, tprCNN3)
    plt.plot(fprCNN3, tprCNN3, lw=4, label=f'CNN3, ROC area = {roc_aucCNN3:.5f})')
    # 
    y_scoreDCNN = modelDCNN.predict(X_test_DCNN_sc)[:, 1]
    fprDCNN, tprDCNN, thresholds = roc_curve(y_testRaw, y_scoreDCNN)
    roc_aucDCNN = auc(fprDCNN, tprDCNN)
    plt.plot(fprDCNN, tprDCNN, lw=4, label=f'DCNN, ROC area = {roc_aucDCNN:.5f})')
    # 
    y_scoreFCN = modelFCN.predict(X_test_FCN_sc)[:, 1]
    fprFCN, tprFCN, thresholds = roc_curve(y_testRaw, y_scoreFCN)
    roc_aucFCN = auc(fprFCN, tprFCN)
    plt.plot(fprFCN, tprFCN, lw=4, label=f'FCN, ROC area = {roc_aucFCN:.5f})')
    # 
    y_scoreAE = modelAE.predict(X_test_AE_sc)[:, 1]
    fprAE, tprAE, thresholds = roc_curve(y_testRaw, y_scoreAE)
    roc_aucAE = auc(fprAE, tprAE)
    plt.plot(fprAE, tprAE, lw=4, label=f'AE+BiLSTM, ROC area = {roc_aucAE:.5f})')

    y_scoreYang = modelYang.predict(X_test_Yang_sc)[:, 1]
    fprYang, tprYang, thresholds = roc_curve(y_testYang, y_scoreYang)
    roc_aucYang = auc(fprYang, tprYang)
    plt.plot(fprYang, tprYang, lw=4, label=f'ConvLSTM, ROC area = {roc_aucYang:.5f})')

    
    plt.plot([0, 1], [0, 1], color='black', lw=2, linestyle='--')
    
    plt.xlabel('False Positive Rate', fontsize=22)
    plt.ylabel('True Positive Rate', fontsize=22)
    plt.xticks(fontsize=20) #rotation=45
    plt.yticks(fontsize=20)
    plt.legend(loc='lower right', fontsize=20)
    
    fignamesvg= name+'_ROC.svg'
    fignamepng= 'png_'+name+'_ROC.png'
    plt.savefig(fignamesvg, dpi=500, bbox_inches='tight')
    plt.savefig(fignamepng, dpi=500, bbox_inches='tight')


import sys
FeaturePath = sys.argv[1]
ScalerPathML = sys.argv[2]
ModelPathML = sys.argv[3]
ScalerPathDL = sys.argv[4]
ModelPathDL = sys.argv[5]
name = sys.argv[6]

ROC(FeaturePath, ScalerPathML, ModelPathML, ScalerPathDL, ModelPathDL, name)