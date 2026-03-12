def eegResult(Array):
    import numpy as np
    from featureCalculation import featureCalculation
    from eegPrediciton import eegPrediciton
    prediction = []
    FreqSampleo = 256
    array = np.array(Array, ndmin=2)
    Names=['Fp1-F7', 'P7-T3', 'T3-T5', 'T5-O1', 'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2', 'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1', 'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2', 'Fz-Cz', 'Cz-Pz']
    elements = (array.size/(FreqSampleo*5*18)) // 1
    length = elements*5*FreqSampleo
    for j in range(0, int(length), int(5*FreqSampleo)):
        subset = array[:,j:j+(5*FreqSampleo)]
        zeros = np.zeros((subset.shape[0],1))
        subsetF = np.hstack((subset, zeros)) 
        feature = featureCalculation(subsetF)
        pred = eegPrediciton(feature)
        prediction.append(pred[0])
    return prediction
