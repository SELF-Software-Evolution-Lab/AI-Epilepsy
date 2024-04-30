def analyzeEEGFile(zip_file):
       from filePredict import filePredict  
       import zipfile
       import os
       result={}
       with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            zip_ref.extractall("extracted_files")
       for filename in zip_ref.namelist():
             file_path = os.path.join("extracted_files", filename)
             if os.path.isfile(file_path):
                  result[os.path.basename(filename)] = filePredict(file_path)
       return result