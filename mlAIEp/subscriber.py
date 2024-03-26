import json
import pika
from sys import path
from os import environ

rabbit_host = '172.16.238.13'
rabbit_user = 'amqpuser'
rabbit_password = 'ai_epilepsy10*'
rabbit_queue_name = 'my-predictions'

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=rabbit_host, credentials=pika.PlainCredentials(rabbit_user, rabbit_password)))
channel = connection.channel()


def callback(ch, method, properties, body):
    print(f" [x] Received {body}")


channel.basic_consume(queue=rabbit_queue_name, on_message_callback=callback, auto_ack=True)

print('> Waiting requests. To exit press CTRL+C')

channel.start_consuming()
