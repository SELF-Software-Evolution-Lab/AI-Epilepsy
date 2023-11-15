

import { responseUtility } from "@core/responseUtility"
import { Notification } from '@app/models'

class NotificationService {
  
  constructor () {}
  
  /**
  * Inserts or updates a notification based on provided parameters.
  * @param {Object} _params - Object containing parameters for notification insertion or update.
  * @returns {Promise<Object>} A Promise containing the result of the insertion or update operation.
  */
  public async insertOrUpdate (_params: any) {
    try{
      // Check if an ID is provided; if true, update an existing notification
      if(_params.id){
        const exists = await Notification.findOne({ where: { id: _params.id } })
        // If the notification doesn't exist, return an error response
        if(!exists) return responseUtility.error('notification.not_found')
        // Update the existing notification
        const _notification = await Notification.update(_params, { where: { id: _params.id } })
        // Retrieve the updated notification
        const notification = await Notification.findOne({ where: { id: _params.id } })
        // Return a success response with the updated notification
        return responseUtility.success({notification: notification})
      } else {
        // If no ID is provided, create a new notification
        
        // Create a new notification
        const _notification = await Notification.create(_params)
        // Retrieve the created notification
        const notification = _notification.toJSON()
        // Return a success response with the created notification
        return responseUtility.success({notification})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('notification.insert_update.fail_action')
    }
  }
  
  /**
  * Retrieves a list of notifications based on provided parameters.
  * @param {Object} _params - Object containing parameters for notification listing.
  * @returns {Promise<Object>} A Promise containing the list of notifications.
  */
  public async list (_params: any) {
    try{
      // Extract page and number parameters for pagination
      const { page, number } = _params
      
      // Initialize the query object with default values
      const query = {
        where: {},
      }
      
      // Add pagination parameters to the query if provided
      if(page && number){
        query['limit'] = number
        query['offset'] = (page - 1) * number
      }
      
      // Retrieve the list of notifications based on the query
      const notifications = await Notification.findAll(query)
      
      // Return a success response with the list of notifications
      return responseUtility.success({notifications})
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Deletes a notification based on the provided ID.
  * @param {Object} _params - Object containing the ID of the notification to be deleted.
  * @returns {Promise<Object>} A Promise containing the result of the deletion operation.
  */
  public async delete (_params: any) {
    try{
      // Check if the notification with the provided ID exists
      const exists = await Notification.findOne({ where: { id: _params.id } })
      // If the notification doesn't exist, return an error response
      if(!exists) return responseUtility.error('notification.not_found')
      // Delete the notification with the provided ID
      await Notification.destroy({ where: { id: _params.id } })
      // Return a success response with the deleted notification
      return responseUtility.success({notification: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('notification.list.fail_action')
    }
  }
  
  /**
  * Retrieves a notification based on the provided ID.
  * @param {Object} _params - Object containing the ID of the notification to be retrieved.
  * @returns {Promise<Object>} A Promise containing the retrieved notification.
  */
  public async get (_params: any) {
    try{
      // Retrieve the notification with the provided ID
      const notification = await Notification.findOne({ where: { id: _params.id } })
      // If the notification doesn't exist, return an error response
      if(!notification) return responseUtility.error('notification.not_found')
      
      // Return a success response with the retrieved notification
      return responseUtility.success({notification})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('notification.get.fail_action')
    }
  }
  
  /**
  * A test method that can be used for experimentation or development purposes.
  * @param {Object} _params - Parameters for the test method.
  * @returns {Promise<Object>} A Promise containing the result of the test operation.
  */
  public async test (_params: any) {
    try{
      
      return responseUtility.success()
    } catch (error) {
      console.log('error', error)
    }
  }
  
}

export const notificationService = new NotificationService()
export { NotificationService }