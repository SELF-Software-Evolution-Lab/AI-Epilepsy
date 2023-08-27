import { Request, Response } from 'express'
import { responseUtility } from '@core/responseUtility'
import { PatientService } from '@app/services/patient/patientService'

class PatientController {
  

  private service = new PatientService()

  constructor () {}




  public test = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.test(_params)
    return responseUtility.build(res, response)
  }

}


export const patientController = new PatientController()
export { PatientController }