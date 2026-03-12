def eegPrediciton(feature):
    import numpy as np
    import joblib
    from tensorflow.keras.models import load_model
    import pandas as pd
    import os
    current_dir = os.getcwd()
    pipelinesLocation=os.path.join(current_dir)
    model_path=os.path.join(pipelinesLocation, 'pipelines', 'CNN1.h5')     # Model Location
    scaler_path=os.path.join(pipelinesLocation, 'pipelines', 'CNN1Scaler.pkl')   # Scaler Location
    sc=joblib.load(scaler_path)
    model=load_model(model_path)
    value=pd.DataFrame(feature)
    value=value.T
    value = sc.transform(value)
    pred = model.predict(value)    
    return pred
