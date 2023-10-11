import {  OUTBOUND_QUEUE, rabbitUtility } from "@core/rabbitUtility";
import { responseUtility } from "@core/responseUtility";
import { predictionService } from "@app/services/prediction/predictionService";

class QueueService {
  
  private static instance: QueueService

  constructor() {
  }
  

  public async sendMessage (message:string){
    try{
      const channel = await rabbitUtility.get_channel_outbound()
      channel.sendToQueue(OUTBOUND_QUEUE, Buffer.from(message))
      channel.close()
      return responseUtility.success({message})
    } catch (error) {
      console.log('error', error)
    }
  }

  public async connect_inbound () {
    try{
      const channel = await rabbitUtility.connect_channel_inbound(this.onMessage)
    } catch (error) {
      console.log('error', error)
    }
  }


  public async onMessage (message:any){
    try{
      const content = JSON.parse(Buffer.from(message.content, "utf-8").toString()) 
      const _prediction = await predictionService.get({id: content.prediction})
      if(_prediction.code !== 200) return _prediction
      const prediction = _prediction.prediction
      
      const update = predictionService.insertOrUpdate({
        id: prediction.id,
        result: content.result,
        label: 'Stopped'
      })

      return responseUtility.success()

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