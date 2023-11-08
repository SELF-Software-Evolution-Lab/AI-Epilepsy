import { Request, Response } from 'express'
import { responseUtility } from '@core/responseUtility'
import { FinderService } from '@app/services/finder/finderService'

class FinderController {
  

  private service = new FinderService()

  constructor () {}


  public test = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.test(_params)
    return responseUtility.build(res, response)
  }
  public tree = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.tree(_params)
    return responseUtility.build(res, response)
  }

  public goTo = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.goTo(_params)
    return responseUtility.build(res, response)
  }

  public transfer = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.transfer(_params)
    return responseUtility.build(res, response)
  }
}


export const finderController = new FinderController()
export { FinderController }