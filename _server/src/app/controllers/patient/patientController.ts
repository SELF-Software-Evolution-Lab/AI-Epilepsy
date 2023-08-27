import { Request, Response } from 'express'
import { responseUtility } from '@core/responseUtility'
import { PatientService } from '@app/services/patient/patientService'

class PatientController {
  

  private service = new PatientService()

  constructor () {}


  public create = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.insertOrUpdate(_params)
    return responseUtility.build(res, response)
  }

  public update = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.insertOrUpdate(_params)
    return responseUtility.build(res, response)
  }

  public list = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.list(_params)
    return responseUtility.build(res, response)
  }

  public delete = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.delete(_params)
    return responseUtility.build(res, response)
  }

  public get = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.get(_params)
    return responseUtility.build(res, response)
  }

  public test = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.test(_params)
    return responseUtility.build(res, response)
  }

}


export const patientController = new PatientController()
export { PatientController }