

import { responseUtility } from "@core/responseUtility"
import { Event } from '@app/models'

class EventService {
  
  constructor () {}

  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        const exists = await Event.findOne({ where: { id: _params.id } })
        if(!exists) return responseUtility.error('event.not_found')
        const _event = await Event.update(_params, { where: { id: _params.id } })
        const event = await Event.findOne({ where: { id: _params.id } })
        return responseUtility.success({event: event})
      } else {
        const _event = await Event.create(_params)
        const event = _event.toJSON()
        return responseUtility.success({event})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('event.insert_update.fail_action')
    }
  }

  public async list (_params: any) {
    try{

      const { page, number } = _params

      const query = {
        where: {},
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

  public async delete (_params: any) {
    try{
      const exists = await Event.findOne({ where: { id: _params.id } })
      if(!exists) return responseUtility.error('event.not_found')
      await Event.destroy({ where: { id: _params.id } })
      return responseUtility.success({event: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('event.list.fail_action')
    }
  }

  public async get (_params: any) {
    try{
      const event = await Event.findOne({ where: { id: _params.id } })
      if(!event) return responseUtility.error('event.not_found')
      return responseUtility.success({event})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('event.get.fail_action')
    }
  }

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