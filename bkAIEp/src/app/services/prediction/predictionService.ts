

import { responseUtility } from "@core/responseUtility"
import { Prediction } from '@app/models'
import { Op } from "sequelize"
import { queueService } from "@app/services/queue/queueService"

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

        if(!_params.mri && !_params.arn && !_params.eeg) return responseUtility.error('prediction.insert_update.need_at_least_a_exam')

        const _data:any = {}

        if(_params.mri && _params.mri.file){
          _data.mri = _params.mri.file
        }

        if(_params.arn && _params.arn.file){
          _data.arn = _params.arn.file
        }

        if(_params.eeg && _params.eeg.file){
          _data.eeg = _params.eeg.file
        }

        const _p:any = {
          patient_id:  _params.patient_id,
          label: 'Requested',
          result: 0,
          prediction_data: JSON.stringify(_data)
        }

        const _prediction = await Prediction.create(_p)
        const prediction = _prediction.toJSON()

        _data.patient_id = _params.patient_id,
        _data.prediction = prediction.id

        if(_prediction){
          await queueService.sendMessage(JSON.stringify(_data))
        }

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
      return responseUtility.success({prediction: prediction.dataValues})
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