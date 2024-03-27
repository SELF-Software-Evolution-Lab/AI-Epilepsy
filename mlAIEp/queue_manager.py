import json
import pika
from ftp_helper import *
from sys import path
from os import environ

rabbit_host = environ.get("RABBITMQ_DEFAULT_HOST")
rabbit_user = environ.get("RABBITMQ_DEFAULT_USER")
rabbit_password = environ.get("RABBITMQ_DEFAULT_PASS")
rabbit_queue_name_read = 'my-predictions'
rabbit_queue_name_write = 'my-predictions-anws'

credentials = pika.PlainCredentials(rabbit_user, rabbit_password)
connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbit_host, credentials=credentials))
channel = connection.channel()

channel.queue_declare(rabbit_queue_name_read, durable=True)
print('> Declared queue for new prediction requests')
channel.queue_declare(rabbit_queue_name_write, durable=True)
print('> Declared queue for new prediction responses')

def callback(ch, method, properties, body):
    print(f" [x] Received {body}")
    payload = json.loads(body.decode('utf8').replace("'", '"'))
    answer_pred = predict(payload)
    answer_json = json.dumps(answer_pred)
    ch.basic_publish(exchange='', routing_key=rabbit_queue_name_write, body=answer_json)
    print(" [x] Sent "+answer_json)

def predict(payload):
    answer = {}
    mri_dir = payload['mridir']
    mri_file = payload['mrifile']
    print("Predicting from mri file "+mri_file+" at "+mri_dir)
    if (mri_file.len()>0):
       fetch_file(mri_dir,mri_file,"mriPred.zip")
       answer.update(predict_mri("mriPred.zip"))
    eeg_dir = payload['eegdir']
    eeg_file = payload['eegfile']
    print("Predicting from eeg file "+eeg_file+" at "+eeg_dir)
    if (eeg_file.len()>0):
       fetch_file(eeg_dir,eeg_file,"eegPred.zip")
       answer.update(predict_eeg("eegPred.zip"))
    return answer

def predict_mri(local_file):
    answer = {'mriPred': "Negative"}
    return answer

def predict_eeg(local_file):
    answer = {'eegPred': "Negative"}
    return answer

channel.basic_consume(queue=rabbit_queue_name_read, on_message_callback=callback, auto_ack=True)

print('> Waiting requests. To exit press CTRL+C')

channel.start_consuming()
