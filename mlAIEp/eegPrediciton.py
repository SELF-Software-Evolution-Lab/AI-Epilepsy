def eegPrediciton(feature):
    import numpy as np
    import joblib
    import pandas as pd
    import os
    from sklearn.preprocessing import StandardScaler
    current_dir = os.getcwd()
    pipelinesLocation=os.path.join(current_dir)
    model_path=os.path.join(pipelinesLocation, 'CNN1.h5')     # Model Location
    scaler_path=os.path.join(pipelinesLocation, 'CNN1Scaler.pkl')   # Scaler Location
    #sc=StandardScaler()
    sc=joblib.load(scaler_path)
    model=joblib.load(model_path)
    value=pd.DataFrame(feature)
    value=value.T
    value = sc.transform(value)
    pred = model.predict(value)    
    return pred
