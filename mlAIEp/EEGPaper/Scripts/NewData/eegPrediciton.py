def eegPrediciton(feature):
    import numpy as np
    import joblib
    import pandas as pd
    import os
    current_dir = os.getcwd()
    pipelinesLocation=os.path.join(current_dir, 'pipelines')
    model_path=os.path.join(pipelinesLocation, 'ModelAI.pkl')     # Model Location
    scaler_path=os.path.join(pipelinesLocation, 'ScalerAI.pkl')   # Scaler Location
    sc=joblib.load(scaler_path)
    model=joblib.load(model_path)
    value=pd.DataFrame(feature)
    value=value.T
    value = sc.transform(value)
    pred = model.predict(value)    
    return pred
