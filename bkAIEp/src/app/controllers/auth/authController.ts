import { Request, Response } from 'express'
import { responseUtility } from '@core/responseUtility'
import { AuthService } from '@app/services/auth/authService'

class AuthController {
  

  private service = new AuthService()

  constructor () {}

  public login = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.login(_params)
    return responseUtility.build(res, response)
  }

  public signUp = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.signUp(_params)
    return responseUtility.build(res, response)
  }

  public test = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.test(_params)
    return responseUtility.build(res, response)
  }

}


export const authController = new AuthController()
export { AuthController }