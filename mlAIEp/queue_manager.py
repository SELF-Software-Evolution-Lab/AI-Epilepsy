import json
import pika
from ftp_helper import *
from analyzeEEGFile import *
from analyzeRNAFile import *
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
    answer_json = json.dumps(answer_pred, sort_keys=True, indent=4)
    ch.basic_publish(exchange='', routing_key=rabbit_queue_name_write, body=answer_json)
    print(" [x] Sent "+answer_json)

def predict(payload):
    answer = {}
    answer['patient_id'] = payload.get('patient_id',-1)
    answer['prediction_id'] = payload.get('prediction_id',-1)
    mri_path = payload.get('mripath',None)
    mri_file = payload.get('mrifile',None)
    if (mri_path is not None):
        print("Predicting from mri file "+mri_file+" at "+mri_path)
        fetch_file(mri_path,mri_file,"mriPred.zip")
        answer.update(predict_mri("mriPred.zip"))
    eeg_path = payload.get('eegpath',None)
    eeg_file = payload.get('eegfile',None)
    if (eeg_path is not None):
        print("Predicting from eeg file "+eeg_file+" at "+eeg_path)
        fetch_file(eeg_path,eeg_file,"eegPred.zip")
        answer.update(predict_eeg("eegPred.zip"))
    rna_path = payload.get('rnapath',None)
    rna_file = payload.get('rnafile',None)
    if (rna_path is not None):
        print("Predicting from rna file "+rna_file+" at "+rna_path)
        fetch_file(rna_path,rna_file,"rnaPred.zip")
        answer.update(predict_rna("rnaPred.zip"))
    answer['result'] = 0
    return answer

def predict_mri(local_file):
    answer = {'mri_data': {"Lesion":"None"}}
    return answer

def predict_eeg(local_file):
    answer = {'eeg_data': analyzeEEGFile(local_file)}
    #answer = {'eeg_data': {"File1": ",5,10,30,40","File2": ",20,50"}}
    return answer
    
def predict_rna(local_file):
    answer = {'rna_data': analyzeRNAFile(local_file)}
    return answer

channel.basic_consume(queue=rabbit_queue_name_read, on_message_callback=callback, auto_ack=True)

print('> Waiting requests. To exit press CTRL+C')

channel.start_consuming()
