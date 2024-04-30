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