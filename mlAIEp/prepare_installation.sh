#Meant for use in Ubuntu 20.04 Onwards

echo "Installing system dependencies..."
apt-get install python3-full python3-pip gcc git -y

echo "Cloning Data..."
git clone https://github.com/OpenNeuroDatasets/ds004199.git

echo "Changing name of Data Folder..."
mv ./ds004199 ./Datos

echo "generating Venv environment..."
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r requirementsAll.txt

echo "Done!"