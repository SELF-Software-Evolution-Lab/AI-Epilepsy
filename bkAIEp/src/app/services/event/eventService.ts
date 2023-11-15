

import { responseUtility } from "@core/responseUtility"
import { Event } from '@app/models'
import { Op } from "sequelize"

class EventService {
  
  constructor () {}
  
  /**
  * Inserts or updates an event record based on the presence of 'id' in _params.
  * @param _params - Event parameters.
  * @returns Promise<{event: Event}> - Promise containing the event object.
  */
  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        // Update existing event
        const exists = await Event.findOne({ where: { id: _params.id } })
        // Update the event record
        if(!exists) return responseUtility.error('event.not_found')
        // Retrieve and return the updated event
        const _event = await Event.update(_params, { where: { id: _params.id } })
        const event = await Event.findOne({ where: { id: _params.id } })
        return responseUtility.success({event: event})
      } else {
        // Insert new event
        const _event = await Event.create(_params)
        const event = _event.toJSON()
        return responseUtility.success({event})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('event.insert_update.fail_action')
    }
  }
  
  /**
  * Retrieves a list of events based on the provided parameters.
  * @param _params - Query parameters for filtering events.
  * @returns Promise<{events: Event[]}> - Promise containing the list of events.
  */
  public async list (_params: any) {
    try{
      
      const { page, number } = _params
      
      const query = {
        where: {},
      }
      
      // Construct the query based on provided parameters
      if(_params.patient_id){
        query.where['patient_id'] = {
          [Op.eq]: _params.patient_id
        }
      }
      
      if(page && number){
        query['limit'] = number
        query['offset'] = (page - 1) * number
      }
      
      const events = await Event.findAll(query)
      return responseUtility.success({events})
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Deletes an event record based on the provided parameters.
  * @param _params - Parameters for identifying the event to be deleted.
  * @returns Promise<{event: Event}> - Promise containing the deleted event object.
  */
  public async delete (_params: any) {
    try{
      // Check if the event exists
      const exists = await Event.findOne({ where: { id: _params.id } })
      // Delete the event record
      if(!exists) return responseUtility.error('event.not_found')
      // Return the deleted event
      await Event.destroy({ where: { id: _params.id } })
      return responseUtility.success({event: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('event.list.fail_action')
    }
  }
  
  /**
  * Retrieves details of a specific event based on the provided parameters.
  * @param _params - Parameters for identifying the event to be retrieved.
  * @returns Promise<{event: Event}> - Promise containing the retrieved event object.
  */
  public async get (_params: any) {
    try{
      // Find the event based on the provided ID
      const event = await Event.findOne({ where: { id: _params.id } })
      // Return the retrieved event
      if(!event) return responseUtility.error('event.not_found')
      return responseUtility.success({event})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('event.get.fail_action')
    }
  }
  
  /**
  * A placeholder method for testing purposes.
  * @param _params - Parameters for the test.
  * @returns Promise<void> - Promise indicating the success of the test.
  */
  public async test (_params: any) {
    try{
      
      return responseUtility.success()
    } catch (error) {
      console.log('error', error)
    }
  }
  
}

export const eventService = new EventService()
export { EventService }