#!/usr/bin/env python
# coding: utf-8

def display_metrics(y_true, y_pred, name):
    import matplotlib.pyplot as plt
    from sklearn.metrics import recall_score, precision_score, accuracy_score, confusion_matrix, ConfusionMatrixDisplay, f1_score, classification_report
    recall = recall_score(y_true, y_pred, average='macro')
    pres = precision_score(y_true, y_pred, average='macro')
    accur = accuracy_score(y_true, y_pred)
    f1_scr = f1_score(y_true, y_pred, average='macro')
    conf_mtx = confusion_matrix(y_true, y_pred)
    all_metric = classification_report(y_true, y_pred)

    print(f'Recall: {recall}')
    print(f'Precision: {pres}')
    print(f'Accuracy: {accur}')
    print(f'f1_score: {f1_scr}')
    disp = ConfusionMatrixDisplay(conf_mtx)
    disp.plot()
    figname=name+'_Conf.png'
    plt.savefig(figname, dpi=300, bbox_inches='tight')


def mlTrainning(SeizureFile, NoSeizureFile, name):
    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    import joblib
    import os
    from sklearn.model_selection import GridSearchCV
    from sklearn.svm import SVC
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.linear_model import SGDClassifier
    from sklearn.neighbors import KNeighborsClassifier
    from sklearn.naive_bayes import BernoulliNB
    from sklearn.model_selection import cross_validate
        
    current_dir = os.getcwd()
    
    print("Data")
  
    df_Seizure = pd.read_csv(SeizureFile, header=None, sep='\t')
    df_NoSeizure = pd.read_csv(NoSeizureFile, header=None, sep='\t')
  
    df_Seizure = df_Seizure.drop(0, inplace=False, axis=1)
    df_NoSeizure = df_NoSeizure.drop(0, inplace=False, axis=1)
  
    df_Seizure = df_Seizure.T
    df_NoSeizure = df_NoSeizure.T
  
    df_Seizure = df_Seizure.dropna()
    df_NoSeizure = df_NoSeizure.dropna()
  
    rowsZeroS = df_Seizure[df_Seizure.eq(0).all(axis=1)]
    rowsZeroNS = df_NoSeizure[df_NoSeizure.eq(0).all(axis=1)]
  
    df_Seizure = df_Seizure.drop(rowsZeroS.index)
    df_NoSeizure = df_NoSeizure.drop(rowsZeroNS.index)
  
    df_Seizure['Label'] = 1
    df_NoSeizure['Label'] = 0
    df = pd.concat([df_NoSeizure, df_Seizure], ignore_index=True)
  
    y = df['Label']
    X= df.drop('Label', inplace=False, axis=1)
  
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=2)
  
    scalerDirectory=os.path.join(current_dir, 'Scalers')
    modelDirectory=os.path.join(current_dir, 'Models')

    print("Scaler")
  
    sc = StandardScaler()
    X_train_sc = sc.fit_transform(X_train)
    scalerName = name + '_Scaler.pkl'
    scaler_file=os.path.join(scalerDirectory, scalerName)
    joblib.dump(sc, scaler_file)
    X_test_sc = sc.transform(X_test) 
   
    print("DefaultModels")
  
    # Modelos con parametros por defecto
    # SGD
    SGD = SGDClassifier(loss='log_loss')
    SGD.fit(X_train_sc, y_train)
    # SVM
    SVM = SVC(probability=True)
    SVM.fit(X_train_sc, y_train)
    # RF-Classifier
    RFC = RandomForestClassifier()
    RFC.fit(X_train_sc, y_train)
    # DT-Classifier
    DTC = DecisionTreeClassifier(max_depth=10)
    DTC.fit(X_train_sc, y_train)
    # KNN
    KNN = KNeighborsClassifier(n_neighbors=100)
    KNN.fit(X_train_sc, y_train)
    #GaussianNB
    NBC = BernoulliNB()
    NBC.fit(X_train_sc, y_train)

    print("CrossValidation")
  
    cv_results_SGD = cross_validate(SGD, X_train_sc, y_train, scoring=('accuracy', 'f1'), cv = 5)
    cv_results_SVM = cross_validate(SVM, X_train_sc, y_train, scoring=('accuracy', 'f1'), cv = 5)
    cv_results_RFC = cross_validate(RFC, X_train_sc, y_train, scoring=('accuracy', 'f1'), cv = 5)
    cv_results_DTC = cross_validate(DTC, X_train_sc, y_train, scoring=('accuracy', 'f1'), cv = 5)
    cv_results_KNN = cross_validate(KNN, X_train_sc, y_train, scoring=('accuracy', 'f1'), cv = 5)
    cv_results_NBC = cross_validate(NBC, X_train_sc, y_train, scoring=('accuracy', 'f1'), cv = 5)

    print(cv_results_SGD)
    print(cv_results_SVM)
    print(cv_results_RFC)
    print(cv_results_DTC)
    print(cv_results_KNN)
    print(cv_results_NBC)


    print("GridSearchCV")
  

    from sklearn.model_selection import GridSearchCV
    param_RFC = {
      'n_estimators': [100, 300],
      'min_samples_split': [2, 10],
      'min_samples_leaf': [1, 4],
      'criterion': ['gini', 'entropy']
    }
    grid_RF = GridSearchCV(estimator=RFC,param_grid=param_RFC,scoring=['accuracy'],refit= 'accuracy',verbose=4,cv=3, error_score='raise')
    grid_RF.fit(X_train_sc, y_train)
  
    print("Best Parameters:", grid_RF.best_params_)
    print("Best Score:", grid_RF.best_score_)

    print("Grid")
  
    y_pred_test = grid_RF.predict(X_test_sc)
    nameGrid=name+'Grid'
    print(display_metrics(y_test, y_pred_test, nameGrid))

    print("SGD")

    y_pred_testSGD = SGD.predict(X_test_sc)
    nameSGD=name+'_SGD'
    print(display_metrics(y_test, y_pred_testSGD, nameSGD))

    print("SVM")
  
    y_pred_testSVM = SVM.predict(X_test_sc)
    nameSVM=name+'_SVM'
    print(display_metrics(y_test, y_pred_testSVM, nameSVM))

    print("RFC")
  
    y_pred_testRFC = RFC.predict(X_test_sc)
    nameRFC=name+'_RFC'
    print(display_metrics(y_test, y_pred_testRFC, nameRFC))

    print("DTC")
  
    y_pred_testDTC = DTC.predict(X_test_sc)
    nameDTC=name+'_DTC'
    print(display_metrics(y_test, y_pred_testDTC, nameDTC))

    print("KNN")
  
    y_pred_testKNN = KNN.predict(X_test_sc)
    nameKNN=name+'_KNN'
    print(display_metrics(y_test, y_pred_testKNN, nameKNN))

    print("NBC")
  
    y_pred_testNBC = NBC.predict(X_test_sc)
    nameNBC=name+'_NBC'
    print(display_metrics(y_test, y_pred_testNBC, nameNBC))

    print("SaveModel")
       
    SGDName=name+'_SGD_Model.pkl'
    SGD_file=os.path.join(modelDirectory, SGDName) 
    joblib.dump(SGD, SGD_file)
  
    SVMName=name+'_SVM_Model.pkl'
    SVM_file=os.path.join(modelDirectory, SVMName)
    joblib.dump(SVM, SVM_file)
  
    RFCName=name+'_RFC_Model.pkl'
    RFC_file=os.path.join(modelDirectory, RFCName)
    joblib.dump(RFC, RFC_file)
  
    DTCName=name+'_DTC_Model.pkl'
    DTC_file=os.path.join(modelDirectory, DTCName)
    joblib.dump(DTC, DTC_file)
  
    KNNName=name+'_KNN_Model.pkl'
    KNN_file=os.path.join(modelDirectory, KNNName)
    joblib.dump(KNN, KNN_file)
  
    NBCName=name+'_NBC_Model.pkl'
    NBC_file=os.path.join(modelDirectory, NBCName)
    joblib.dump(NBC, NBC_file)
  
    grid_RFName=name+'_Grid_Model.pkl'
    grid_RF_file=os.path.join(modelDirectory, grid_RFName)
    joblib.dump(grid_RF, grid_RF_file)
  
import sys
SeizureFile = sys.argv[1]
NoSeizureFile = sys.argv[2]
name = sys.argv[3]

print("Hola, Mundo")

mlTrainning(SeizureFile, NoSeizureFile, name)
  
