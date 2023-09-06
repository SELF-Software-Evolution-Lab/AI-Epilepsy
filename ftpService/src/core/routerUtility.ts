import { Request, Response, Application } from 'express';



interface IRouteParams {
  method: string
  path: string
  handler: (req: Request, res: Response) => Promise<any>
  middleware: any[] | any
}

class RouterUtility {
  
  private app: Application
  private prefix: string
  
  constructor(app:Application, prefix:string){
    this.app = app
    this.prefix = prefix
  }

  public route(_params: IRouteParams){
    try{
      this.app[_params.method](`${this.prefix}${_params.path}`, _params.middleware, _params.handler)
    } catch (error) {
      console.log('error', error)
    }
  }
}

export { RouterUtility, IRouteParams }