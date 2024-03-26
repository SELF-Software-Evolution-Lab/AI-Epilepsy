import json
import pika
from sys import path
from os import environ
#import django

rabbit_host = '172.16.238.13'
rabbit_user = 'amqpuser'
rabbit_password = 'ai_epilepsy10*'
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
    answer_pred = predict(body)
    ch.basic_publish(exchange='', routing_key=rabbit_queue_name_write, body=answer_pred)
    print(" [x] Sent 'Hello World!'")

def predict(body):
    return 'Hello World!'

channel.basic_consume(queue=rabbit_queue_name_read, on_message_callback=callback, auto_ack=True)

print('> Waiting requests. To exit press CTRL+C')

channel.start_consuming()
