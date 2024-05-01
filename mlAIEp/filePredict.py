#Output: List of 0s and 1s.
# Each item on the list represents 5 seconds of the exam from the edf file. 
# The list is organized chronologically, meaning the first element represents time from 0s to 5s. Second one, from 5s to 10s and so on.
# 1 means that the 5 second fragment is from a seizure and 0 that is seizure-free.
def filePredict(file_path):
    from eegArray import eegArray
    from eegResult import eegResult
    import os
    import zipfile
    import numpy as np
    data = eegArray(file_path)
    prediction = eegResult(data)
    results = prediction
    return results
