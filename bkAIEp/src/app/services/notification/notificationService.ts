

import { responseUtility } from "@core/responseUtility"
import { Notification } from '@app/models'

class NotificationService {
  
  constructor () {}

  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        const exists = await Notification.findOne({ where: { id: _params.id } })
        if(!exists) return responseUtility.error('notification.not_found')
        const _notification = await Notification.update(_params, { where: { id: _params.id } })
        const notification = await Notification.findOne({ where: { id: _params.id } })
        return responseUtility.success({notification: notification})
      } else {
        const _notification = await Notification.create(_params)
        const notification = _notification.toJSON()
        return responseUtility.success({notification})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('notification.insert_update.fail_action')
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

      const notifications = await Notification.findAll(query)
      return responseUtility.success({notifications})
    } catch (error) {
      console.log('error', error)
    }
  }

  public async delete (_params: any) {
    try{
      const exists = await Notification.findOne({ where: { id: _params.id } })
      if(!exists) return responseUtility.error('notification.not_found')
      await Notification.destroy({ where: { id: _params.id } })
      return responseUtility.success({notification: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('notification.list.fail_action')
    }
  }

  public async get (_params: any) {
    try{
      const notification = await Notification.findOne({ where: { id: _params.id } })
      if(!notification) return responseUtility.error('notification.not_found')
      return responseUtility.success({notification})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('notification.get.fail_action')
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

export const notificationService = new NotificationService()
export { NotificationService }