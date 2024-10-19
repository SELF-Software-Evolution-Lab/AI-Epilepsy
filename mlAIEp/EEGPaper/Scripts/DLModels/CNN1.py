
#!/usr/bin/env python
# coding: utf-8

# In[46]:

def display_metrics(y_true, y_pred):
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
    conf_name='CNN1Confusion.png'                                      # Conf file name
    plt.savefig(conf_name, dpi=300, bbox_inches='tight')                                               # Save ConfMatrix

def FCN(fileSeizure, fileNoSeizure):
    import pandas as pd
    import numpy as np
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    import tensorflow as tf
    from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, BatchNormalization, Dropout
    from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
    import joblib
    from tensorflow.keras.wrappers.scikit_learn import KerasClassifier
    from sklearn.model_selection import GridSearchCV
    from tensorflow.keras.regularizers import l2

    # Data
    df_Seizure = pd.read_csv(fileSeizure, header=None, sep='\t')
    df_NoSeizure = pd.read_csv(fileNoSeizure, header=None, sep='\t')
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
    # Split
    X_train1, X_test, y_train1, y_test = train_test_split(X, y, test_size=0.1, random_state=2)
    X_train, X_val, y_train, y_val = train_test_split(X_train1, y_train1, test_size=0.1, random_state=2)
    # Estandarizar
    scaler_name='CNN1Scaler.pkl'                               # Scaler file name 
    sc = StandardScaler()
    X_train_sc = sc.fit_transform(X_train)
    joblib.dump(sc, scaler_name)                   # Save Scaler
    X_test_sc = sc.transform(X_test)
    X_val_sc = sc.transform(X_val)

    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Reshape((1281, 18, 1), input_shape=(23058,)))
    model.add(Conv2D(filters=32, kernel_size=(21, 1), strides=(1, 1), activation='relu'))
    model.add(MaxPooling2D(pool_size=(3, 1)))
    model.add(Dropout(0.5))
    model.add(Conv2D(filters=64, kernel_size=(11, 1), strides=(1, 1), activation='relu'))
    model.add(MaxPooling2D(pool_size=(3, 1)))
    model.add(Conv2D(filters=128, kernel_size=(3, 1), strides=(1, 1), activation='relu'))
    model.add(MaxPooling2D(pool_size=(3, 1)))
    model.add(Conv2D(filters=128, kernel_size=(3, 1), strides=(1, 1), activation='relu'))
    model.add(MaxPooling2D(pool_size=(3, 1)))
    model.add(Conv2D(filters=128, kernel_size=(3, 1), strides=(1, 1), activation='relu'))
    model.add(MaxPooling2D(pool_size=(3, 1)))
    model.add(Dropout(0.5))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(2, activation='softmax'))



    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    

    model_filename_CP = 'CNN1Grid.h5'
    early_stopping = EarlyStopping(monitor='loss', patience=10, verbose=1)                                        # CheckPoint File Name file name
    model_checkpoint = ModelCheckpoint(model_filename_CP, monitor='loss', save_best_only=True, verbose=1)
    history=model.fit(X_train_sc, y_train, epochs=150, batch_size=64 , validation_data=(X_val_sc, y_val), callbacks=[early_stopping, model_checkpoint])

    
    print(model.summary())
    print(model_checkpoint)
    
    model_filename = 'CNN1.h5'                                                     # Model File Name
    model.save(model_filename)                                               # Save the model to the file                           
    
    import numpy as np
    y_pred = model.predict(X_test_sc)
    predicted_classes = np.argmax(y_pred, axis=1)
    
    #prediction_name='Prediction.txt'                                     # Predciton file name
          
    #with open(prediction_name, 'w') as file:                 # Save Prediciton
     #   for item in predicted_classes:
      #      file.write("%s\n" % item)
    print(display_metrics(y_test, predicted_classes))

    # file= newPath+'/'+fileName.split(".")[0]+'_'+'StatDesc'+'.txt'
    # np.savetxt(file, StatDesc, fmt=(f'%.5e'))
    
    history_dict = history.history
    loss_values = history_dict['loss']
    val_loss_values = history_dict['val_loss']
    epochs = range(1, len(loss_values) + 1)
    import matplotlib.pyplot as plt
    plt.figure(figsize=(8,8))
    plt.plot(epochs, loss_values, 'r', label='Training loss')
    plt.plot(epochs, val_loss_values, 'b', label='Validation loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()
    LossEpoch_name='CNN1LossEpoch.png'                                      # LossEpoch file name
    plt.savefig(LossEpoch_name, dpi=300, bbox_inches='tight') 
    plt.clf()
    rec = history_dict['accuracy']
    val_rec = history_dict['val_accuracy']
    plt.figure(figsize=(6,6))
    plt.plot(epochs, rec, 'r', label='Training Rec')
    plt.plot(epochs, val_rec, 'b', label='Validation Acc')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()
    AccEpoch_name='CNN1AccEpoch.png'                                      # AccEpoch file name
    plt.savefig(AccEpoch_name, dpi=300, bbox_inches='tight') 

import sys
FileSeizure = sys.argv[1]
FileNoSeizure = sys.argv[2]
FCN(FileSeizure, FileNoSeizure)
