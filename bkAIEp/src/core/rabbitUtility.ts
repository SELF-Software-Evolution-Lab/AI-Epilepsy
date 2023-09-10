import { config } from '@config/env'
import amqp from 'amqplib'

export const INBOUND_QUEUE = 'my-predictions-anws'
export const OUTBOUND_QUEUE = 'my-predictions'
export interface IRabbitConnection extends amqp.Connection{

}

class RabbitUtility {

  private static instance: RabbitUtility
  private connection: amqp.Connection
  private settings: amqp.Options.Connect

  constructor() {
    this.settings = config.rabbit
  }

  public static getInstance() {
    try{
      if (!RabbitUtility.instance) {
        RabbitUtility.instance = new RabbitUtility();
      }
      return RabbitUtility.instance;
    } catch (error) {
      console.log('error', error)
    }
  }

  public async connect() {
    try{
      this.connection = await amqp.connect(this.settings);
      return this.connection
    } catch (error) {
      console.log('error', error)
    }
  }

  public async channel(name: string ,options?: {}) {
    try{
      if(!this.connection) await this.connect()
      const channel = await this.connection.createChannel()
      await channel.assertQueue(name, options)
      return channel
    } catch (error) {
      console.log('error', error)
    }
  }
}

export const rabbitUtility =  RabbitUtility.getInstance()
export { RabbitUtility }