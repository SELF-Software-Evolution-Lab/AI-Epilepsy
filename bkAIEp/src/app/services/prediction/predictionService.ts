

import { responseUtility } from "@core/responseUtility"
import { Prediction } from '@app/models'
import { Op } from "sequelize"

class PredictionService {
  
  constructor () {}

  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        const exists = await Prediction.findOne({ where: { id: _params.id } })
        if(!exists) return responseUtility.error('prediction.not_found')
        const _prediction = await Prediction.update(_params, { where: { id: _params.id } })
        const prediction = await Prediction.findOne({ where: { id: _params.id } })
        return responseUtility.success({prediction: prediction})
      } else {
        const _prediction = await Prediction.create(_params)
        const prediction = _prediction.toJSON()
        return responseUtility.success({prediction})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('prediction.insert_update.fail_action')
    }
  }

  public async list (_params: any) {
    try{

      const { page, number } = _params

      const query = {
        where: {},
      }

      if(_params.patient_id){
        query.where['patient_id'] = {
          [Op.eq]: _params.patient_id
        }
      }
      
      if(page && number){
        query['limit'] = number
        query['offset'] = (page - 1) * number
      }

      const predictions = await Prediction.findAll(query)
      return responseUtility.success({predictions})
    } catch (error) {
      console.log('error', error)
    }
  }

  public async delete (_params: any) {
    try{
      const exists = await Prediction.findOne({ where: { id: _params.id } })
      if(!exists) return responseUtility.error('prediction.not_found')
      await Prediction.destroy({ where: { id: _params.id } })
      return responseUtility.success({prediction: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('prediction.list.fail_action')
    }
  }

  public async get (_params: any) {
    try{
      const prediction = await Prediction.findOne({ where: { id: _params.id } })
      if(!prediction) return responseUtility.error('prediction.not_found')
      return responseUtility.success({prediction})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('prediction.get.fail_action')
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

export const predictionService = new PredictionService()
export { PredictionService }