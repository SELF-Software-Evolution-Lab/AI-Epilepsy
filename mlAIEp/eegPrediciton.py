def eegPrediciton(feature):
    import numpy as np
    import joblib
    import pandas as pd
    model_path='pipelines/ModelAI.pkl'     # Model Location
    scaler_path='pipelines/ScalerAI.pkl'   # Scaler Location
    sc=joblib.load(scaler_path)
    model=joblib.load(model_path)
    value=pd.DataFrame(feature)
    value=value.T
    value = sc.transform(value)
    pred = model.predict(value)    
    return pred