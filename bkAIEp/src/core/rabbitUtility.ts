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
  private channel_outbound : amqp.ChannelModel
  private channel_inbound : amqp.ChannelModel

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
      this.connection = await amqp.connect(this.settings)
      const channel = await this.connection.createChannel()
      return this.connection
    } catch (error) {
      console.log('error', error)
    }
  }

  public async get_channel_outbound() {
    try{
      if(!this.connection) await this.connect()
      const channel = await this.connection.createChannel()
      await channel.assertQueue(OUTBOUND_QUEUE, {})
      this.channel_outbound = channel
      return channel
    } catch (error) {
      console.log('error', error)
    }
  }

  public async connect_channel_inbound(listener) {
    try{
      if(!this.connection) await this.connect()
      const channel = await this.connection.createChannel()
      await channel.assertQueue(INBOUND_QUEUE, {})
      this.channel_inbound = channel
      channel.consume(INBOUND_QUEUE, listener, { noAck: true })
      return channel
    } catch (error) {
      console.log('error', error)
    }
  }
}

export const rabbitUtility =  RabbitUtility.getInstance()
export { RabbitUtility }