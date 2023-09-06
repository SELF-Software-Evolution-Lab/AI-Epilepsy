import { INBOUND_QUEUE, IRabbitConnection, OUTBOUND_QUEUE, rabbitUtility } from "@core/rabbitUtility";
import { responseUtility } from "@core/responseUtility";

class QueueService {
  
  private static instance: QueueService
  private inboundChannel: any
  private outboundChannel: any
  private connection: IRabbitConnection

  constructor() {
  }
  
  public async init (){
    this.connection = await rabbitUtility.connect()
    this.inboundChannel = await rabbitUtility.channel(INBOUND_QUEUE, { durable: true })

    this.inboundChannel.consume(INBOUND_QUEUE, (message) => {
      console.log('Received message:', message.content.toString())
      const _message = message.content.toString()
      this.onMessage(_message)
      this.inboundChannel.ack(message)
    })

    this.outboundChannel = await rabbitUtility.channel(OUTBOUND_QUEUE)
    return this
  }

  public async sendMessage (message:string){
    try{
      if(!this.connection) await this.init()
      this.outboundChannel.sendToQueue(OUTBOUND_QUEUE, Buffer.from(message))
      return responseUtility.success({message})
    } catch (error) {
      console.log('error', error)
    }
  }

  public onMessage (message:string){
    try{
      console.log('-------zadiaz:llegamessage', message)
    } catch (error) {
      console.log('error', error)
    }
  }



  public static getInstance() {
    try{
      if (!QueueService.instance) {
        QueueService.instance = new QueueService();
      }
      return QueueService.instance;
    } catch (error) {
      console.log('error', error)
    }
  }
}

export const queueService =  QueueService.getInstance()
export { QueueService }