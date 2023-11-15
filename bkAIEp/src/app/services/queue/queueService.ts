import {  OUTBOUND_QUEUE, rabbitUtility } from "@core/rabbitUtility";
import { responseUtility } from "@core/responseUtility";
import { predictionService } from "@app/services/prediction/predictionService";

/**
* Service for managing queue.
* @class QueueService
*/
class QueueService {
  
  /**
  * Singleton instance of the QueueService.
  * @private
  * @static
  */
  private static instance: QueueService
  
  /**
  * Creates an instance of QueueService.
  * @memberof QueueService
  */
  constructor() {
  }
  
  
  /**
  * Sends a message to the outbound queue.
  * @param {string} message - The message to be sent.
  * @returns {Promise<Object>} A Promise containing the result of the operation.
  */
  public async sendMessage (message:string){
    try{
      // Get the channel for outbound communication
      const channel = await rabbitUtility.get_channel_outbound()
      // Send the message to the specified outbound queue
      channel.sendToQueue(OUTBOUND_QUEUE, Buffer.from(message))
      // Close the channel
      channel.close()
      return responseUtility.success({message})
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Connects to the inbound queue and sets up the message handler.
  * @returns {Promise<void>} A Promise that resolves when the connection is established.
  */
  public async connect_inbound () {
    try{
      // Connect to the inbound channel with the provided message handler
      const channel = await rabbitUtility.connect_channel_inbound(this.onMessage)
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Message handler for processing inbound messages.
  * @param {any} message - The received message.
  * @returns {Promise<Object>} A Promise containing the result of the processing.
  */
  public async onMessage (message:any){
    try{
      // Parse the content of the message
      const content = JSON.parse(Buffer.from(message.content, "utf-8").toString()) 
      // Get prediction details based on the content
      const _prediction = await predictionService.get({id: content.prediction})
      // If the prediction retrieval fails, return the error response
      if(_prediction.code !== 200) return _prediction
      // Extract prediction details
      const prediction = _prediction.prediction
      //Updates prediction information
      const update = predictionService.insertOrUpdate({
        id: prediction.id,
        result: content.result,
        label: 'Stopped'
      })
      
      // Return a success response
      return responseUtility.success()
      
    } catch (error) {
      console.log('error', error)
    }
  }
  
  
  /**
  * Gets the singleton instance of the QueueService.
  * @returns {QueueService} The singleton instance.
  */
  public static getInstance() {
    try{
      // Create a new instance if it doesn't exist
      if (!QueueService.instance) {
        QueueService.instance = new QueueService();
      }
      return QueueService.instance;
    } catch (error) {
      console.log('error', error)
    }
  }
}

// Create and export the singleton instance of the QueueService
export const queueService =  QueueService.getInstance()
export { QueueService }