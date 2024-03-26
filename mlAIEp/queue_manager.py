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
    ch.basic_publish(exchange='', routing_key=rabbit_queue_name_write, body=answer_pred)
    print(" [x] Sent 'Hello World!'")

def predict(payload):
    mri_file = payload['mri']
    print("Predicting from "+mri_file)
    fetch_file("mri",mri_file,"mri.dat")
    return 'Predicted from '+mri_file

channel.basic_consume(queue=rabbit_queue_name_read, on_message_callback=callback, auto_ack=True)

print('> Waiting requests. To exit press CTRL+C')

channel.start_consuming()
