

import { responseUtility } from "@core/responseUtility"
import { Op } from "sequelize"
import { Patient } from '@app/models'

class PatientService {
  
  constructor () {}

  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        const exists = await Patient.findOne({ where: { id: _params.id } })
        if(!exists) return responseUtility.error('patient.not_found')
        const _patient = await Patient.update(_params, { where: { id: _params.id } })
        const patient = await Patient.findOne({ where: { id: _params.id } })
        return responseUtility.success({patient: patient})
      } else {
        const _patient = await Patient.create(_params)
        const patient = _patient.toJSON()
        return responseUtility.success({patient})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('patient.insert_update.fail_action')
    }
  }

  public async list (_params: any) {
    try{

      const { page, number } = _params

      const query = {
        where: {},
      }

      if(_params.search){
        query.where = {
          ...query.where,
          [Op.or]: [
            { first_name: { [Op.like]: `%${_params.search}%` } },
            { last_name: { [Op.like]: `%${_params.search}%` } },
            { email: { [Op.like]: `%${_params.search}%` } },
            { document_id: { [Op.like]: `%${_params.search}%` } },
            { blood_type: { [Op.like]: `%${_params.search}%` } },
            { emergency_contact_name: { [Op.like]: `%${_params.search}%` } },
            { emergency_contact_phone: { [Op.like]: `%${_params.search}%` } },
          ]
        }
      }
      
      if(page && number){
        query['limit'] = number
        query['offset'] = (page - 1) * number
      }

      const patients = await Patient.findAll(query)
      return responseUtility.success({patients})
    } catch (error) {
      console.log('error', error)
    }
  }

  public async delete (_params: any) {
    try{
      const exists = await Patient.findOne({ where: { id: _params.id } })
      if(!exists) return responseUtility.error('patient.not_found')
      await Patient.destroy({ where: { id: _params.id } })
      return responseUtility.success({patient: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('patient.list.fail_action')
    }
  }

  public async get (_params: any) {
    try{
      const patient = await Patient.findOne({ where: { id: _params.id } })
      if(!patient) return responseUtility.error('patient.not_found')
      return responseUtility.success({patient})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('patient.get.fail_action')
    }
  }

  public async test (_params: any) {
    try{
      const patient = await Patient.create({ name: 'John' })
      const _response = {
        message: 'PatientService.test',
        _params
      }
      return responseUtility.success(_response)
    } catch (error) {
      console.log('error', error)
    }
  }

}

export const patientService = new PatientService()
export { PatientService }