# Scripts to run detection over multiple .edf files

**Input:**

zip file with multiple .edf files

**Output:**

Dictionary where keys are the EDF file name and values a list of ones and zeros [0,1].

Each element in the list represents a 5 second window of the file. When is one means widows has a seizure
and 0 is seaizure free. Elements are organized chronologically. 

Size of the list is *int(D/5)*, where D is the file duration in seconds. *int* function rounds number to the floor.

**Model:**

For this script model CNN1 is used feel free to change it in *eegPrediciton.py*.
Keep in mind that others models should share same data input as CNN1.

**Code to run new prediction from terminal:**

```
zip_file = 'path/to/file/filename.zip'
python3 analyzeEEGFile.py ${zip_file}
