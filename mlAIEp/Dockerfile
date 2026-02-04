FROM python:3.9.16

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY *py ./

COPY pipelines/*txt ./
COPY pipelines/*pkl ./


CMD [ "python","-u", "./queue_manager.py" ]

