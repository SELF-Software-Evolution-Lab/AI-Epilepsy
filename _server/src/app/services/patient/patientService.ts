import moment from 'moment'

import { responseUtility } from "@core/responseUtility"
import { Patient } from '@app/models'

class PatientService {
  
  constructor () {}

  public async insertOrUpdate (_params: any) {
    try{
      
    } catch (error) {
      console.log('error', error)
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