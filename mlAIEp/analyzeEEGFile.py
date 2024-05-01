from filePredict import filePredict
import zipfile
import os
# Input: zip file with multiple .edf files
# Output: Dictionary where keys are the EDF file name. 
def analyzeEEGFile(zip_file):
    result={}
    with zipfile.ZipFile(zip_file, 'r') as zip_ref:
        zip_ref.extractall("extracted_files")
        for filename in zip_ref.namelist():
            file_path = os.path.join("extracted_files", filename)
            if os.path.isfile(file_path):
                filename2 = os.path.basename(filename)
                filePrediction = filePredict(file_path)
                result[filename2] = encodeEEGAnswer(filePrediction,5)
    return result
       
def encodeEEGAnswer(window_pred, window_size):
    answer = ""
    start = -1
    end = -1
    for i in range(len(window_pred)):
        if window_pred[i] == 1 :
            if start==-1 :
                start = window_size*i
            end = window_size*i
        else:
            if start!=-1 :
                answer+=","+start+","+end
            start = -1
    if start!=-1:
        answer+=","+start+","+end
    return answer
