FROM python:3.11

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY *py ./

COPY pipelines/*pkl ./pipelines/

CMD [ "python","-u", "./queue_manager.py" ]

