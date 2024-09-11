#Meant for use in Ubuntu 20.04 Onwards

echo "Installing system dependencies..."
apt-get install python3-full snapd python3-pip gcc git datalad -y
snap install aws-cli --classic -y

echo "Cloning Data..."
aws s3 sync s3://physionet-open/siena-scalp-eeg/1.0.0/ ./EEG_Datos
datalad clone --recursive https://github.com/OpenNeuroDatasets/ds004199.git
git lfs fetch --all

echo "Changing name of Data Folder..."
mv ./ds004199 ./Datos

echo "generating Venv environment..."
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r requirementsAll.txt

echo "Done!"