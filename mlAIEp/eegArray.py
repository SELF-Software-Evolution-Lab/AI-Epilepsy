def eegArray(extracted_file_path):
    import mne
    final_data=[]
    data = mne.io.read_raw_edf(extracted_file_path, preload=True)
    lowpass_cutoff = 0.5
    highpass_cutoff = 70
    notch_frequency = 60
    raw_filtered = data.copy()
    raw_filtered.filter(lowpass_cutoff, highpass_cutoff, fir_design='firwin')
    raw_filtered.notch_filter(notch_frequency, fir_design='firwin')
    Fp1F7=(raw_filtered.copy().pick_channels(['FP1-F7']).get_data()[0])
    final_data.append(Fp1F7)
    F7T3=(raw_filtered.copy().pick_channels(['F7-T7']).get_data()[0])
    final_data.append(F7T3)
    T3T5=(raw_filtered.copy().pick_channels(['T7-P7']).get_data()[0])
    final_data.append(T3T5)
    T5O1=(raw_filtered.copy().pick_channels(['P7-O1']).get_data()[0])
    final_data.append(T5O1)
    Fp2F8=(raw_filtered.copy().pick_channels(['FP2-F8']).get_data()[0])
    final_data.append(Fp2F8)
    F8T4=(raw_filtered.copy().pick_channels(['F8-T8']).get_data()[0])
    final_data.append(F8T4)
    T4T6=(raw_filtered.copy().pick_channels(['T8-P8-0']).get_data()[0])
    final_data.append(T4T6)
    T6O2=(raw_filtered.copy().pick_channels(['P8-O2']).get_data()[0])
    final_data.append(T6O2)
    Fp1F3=(raw_filtered.copy().pick_channels(['FP1-F3']).get_data()[0])
    final_data.append(Fp1F3)
    F3C3=(raw_filtered.copy().pick_channels(['F3-C3']).get_data()[0])
    final_data.append(F3C3)
    C3P3=(raw_filtered.copy().pick_channels(['C3-P3']).get_data()[0])
    final_data.append(C3P3)
    P3O1=(raw_filtered.copy().pick_channels(['P3-O1']).get_data()[0])
    final_data.append(P3O1)
    Fp2F4=(raw_filtered.copy().pick_channels(['FP2-F4']).get_data()[0])
    final_data.append(Fp2F4)
    F4C4=(raw_filtered.copy().pick_channels(['F4-C4']).get_data()[0])
    final_data.append(F4C4)
    C4P4=(raw_filtered.copy().pick_channels(['C4-P4']).get_data()[0])
    final_data.append(C4P4)
    P4O2=(raw_filtered.copy().pick_channels(['P4-O2']).get_data()[0])
    final_data.append(P4O2)
    FzCz=(raw_filtered.copy().pick_channels(['FZ-CZ']).get_data()[0])
    final_data.append(FzCz)
    CzPz=(raw_filtered.copy().pick_channels(['CZ-PZ']).get_data()[0])
    final_data.append(CzPz)
    return final_data