from ftp_helper import *
from analyzeEEGFile import *
fetch_file("/home/user/exams-dev/","patient-1-exam-2-eeg.zip","eegPred.zip")
analyzeEEGFile("eegPred.zip")
