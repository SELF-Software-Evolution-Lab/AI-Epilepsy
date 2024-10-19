# Deep Learning models

Models and data scalers for Seizure detection. Architecture CNN1 and DCNN. 
Reamining models and scaler can be found at https://zenodo.org/records/13954227

The models are applied over EEGs 5 second window returning 1 or 0, where 1 means the window
has a seizure and 0 tha is seizure free.

Input for 6 models is a list with linearized EEG data after preprocessing. 
List size is 23058 elemnts corresponding to 5 seconds, 18 channels and 256 sampling frequency + 1 element per channel.

Code to run detection:

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

For preprocessing documentation go to publication or EEGPaper/Scripts/Others directory.
