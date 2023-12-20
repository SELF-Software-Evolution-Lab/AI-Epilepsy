import joblib
import numpy as np
from pipeline_utilities import *

thresholds = {
    'HEM': {
        'SAG':0.63,
        'COR':0.44,
        'AX':0.56
    },
    'LOBE': {
        'SAG':0.64,
        'COR':0.54,
        'AX':0.56
    }
}

pipelines = {
    'VIEW': joblib.load('./pipelines/pipeline_view.joblib'),
    'SAG': joblib.load('./pipelines/pipeline_sag.joblib'),
    'COR': joblib.load('./pipelines/pipeline_cor.joblib'),
    'AX': joblib.load('./pipelines/pipeline_ax.joblib')
}

def make_prediction(path):
    files, input_data = load_dicom(path)
    result = []
    viewpoint = np.argmax(pipelines['VIEW'].predict(input_data), axis=1)
    
    for i in range(len(viewpoint)):
        proba = []
        model_name = ViewpointEnum(viewpoint[i]).name
            
        proba_hem, proba_lobe = pipelines[model_name].predict_proba([input_data[i]])
        index = 2
        if proba_hem[0][0]+proba_hem[0][1] >= thresholds['HEM'][model_name]:
            index = np.argmax(proba_hem[0][0:2])
        proba_hem = {'class':HemisphereEnum(index).name,'result':proba_hem[0][index]}
        index = 2
        if proba_lobe[0][0]+proba_lobe[0][1] >= thresholds['LOBE'][model_name]:
            index = np.argmax(proba_lobe[0][0:2])
        proba_lobe = {'class':LobeEnum(index).name,'result':proba_lobe[0][index]}
        result.append({'path':files[i],'hem':proba_hem,'lob':proba_lobe})
    return result

# Example prediction
path = './DatosZip/user-2-exam-3.zip'
print(make_prediction(path))