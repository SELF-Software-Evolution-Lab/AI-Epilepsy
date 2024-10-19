def featureCalculation(signal):
    import numpy as np
    transform = np.fft.fft(signal)
    power_spectrum = np.abs(transform) ** 2
    energy = np.sum(power_spectrum)
    return energy