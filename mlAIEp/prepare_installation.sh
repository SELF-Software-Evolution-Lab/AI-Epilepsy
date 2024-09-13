#Meant for use in Ubuntu 20.04 Onwards
#Assumes an installation of anaconda existing

echo "Installing system dependencies..."
apt-get install python3-full snapd python3-pip gcc git datalad -y
snap install aws-cli --classic -y

echo "Cloning Data..."
git clone --recursive https://github.com/OpenNeuroDatasets/ds004199.git
git lfs fetch --all

echo "Changing name of Data Folder..."
mv ./ds004199 ./Datos

echo "generating Venv environment..."
conda init
conda create -n .conda
conda install --file requirementsAll.txt

echo "Done!"