def eegResult(Array):
    from featureCalculation import featureCalculation
    from eegPrediciton import eegPrediciton
    import numpy as np
    prediction = []
    FreqSampleo = 256
    array = np.array(Array, ndmin=2)
    Names=['Fp1-F7', 'P7-T3', 'T3-T5', 'T5-O1', 'Fp2-F8', 'F8-T4', 'T4-T6', 'T6-O2', 'Fp1-F3', 'F3-C3', 'C3-P3', 'P3-O1', 'Fp2-F4', 'F4-C4', 'C4-P4', 'P4-O2', 'Fz-Cz', 'Cz-Pz']
    elements = (array.size/(FreqSampleo*5*18)) // 1
    length = elements*5*FreqSampleo
    for j in range(0, int(length), int(5*FreqSampleo)):
        #prediction=[]
        #for k in range (0,len(Names)):
        #    channel=array[k]
        #    subset = channel[j:j+(5*FreqSampleo)]
        #    feature = featureCalculation(subset)
        #    pred = eegPrediciton(feature)
        #    info.append(Feature)
        #    prediction.append(pred[0])
        subset = array[:,j:j+(5*FreqSampleo)]
        feature = featureCalculation(subset)
        pred = eegPrediciton(feature)
        prediction.append(pred[0])
    return prediction
