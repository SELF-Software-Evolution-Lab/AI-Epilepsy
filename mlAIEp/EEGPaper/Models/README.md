# Detection Models

Models and data scalers for Seizure detection. Architecture CNN1 and DCNN. 
Reamining models and scaler can be found at https://zenodo.org/records/13954227

The models are applied over EEGs 5 second window returning 1 or 0, where 1 means the window
has a seizure and 0 tha is seizure free.

## Deep learning models (CNN1, CNN3, DCNN)

Input for 3 models is a list with linearised EEG data after preprocessing. 
List size is 23058 elemnts corresponding to 5 seconds, 18 channels and 256 sampling frequency + 1 element per channel (Ceiling in subsampling).

CNN3 model and scaler available in zenodo (CNN3Scaler.pkl, CNN3.h5)

## Machine learning models (RFC+All, RFC+PBand, RFC+Wavelets)

Input for the models is a list with linearised features previously calculated.
List size is diffferenmt for each model for go to the publication detailed methods.
For Features calcultaion script go to EEGPaper/Scripts/FeatureCalculation.

All models and scalers available in zenodo:
* RFC+All: All_Scaler.pkl, All_Grid_Model.pkl
* RFC+PBand: PBand_Scaler.pkl, PBand_Grid_Model.pkl
* RFC+Wavelets: Wave_Scaler.pkl, Wave_Grid_Model.pkl

## Code to run detection:

```
import joblib pandas
data=[] #Your data list
sc= joblib.load(scaler_file)
model = joblib.load(model_file)
df = pd.DataFrame(data)
df = df.T
df = sc.transform(df)
pred = model.predict(df)
print(pred)
```

**For preprocessing documentation go to publication or EEGPaper/Scripts/Others directory.**

**To do detction on whole *.edf* files go to EEGPaper/NewData**
