//@IMPORT: Libraries
import { Application } from "express"

//@IMPORT: Controllers
import { PredictionController } from "@app/controllers/prediction/predictionController"

//@IMPORT: Utils
import { RouterUtility, IRouteParams } from "@core/routerUtility"
import { request as auth } from "@app/middleware/authMiddleware"

class PredictionRoute {

  private className:string = 'PredictionRoute'  
  private app: Application
  private routerUtility: RouterUtility
  private controller: PredictionController = new PredictionController()
  
  constructor (app: Application, prefix: string) {
    this.app = app
    this.routerUtility = new RouterUtility(this.app, `${prefix}${this.prefix}`)
  }
  
  private prefix: string = '/predictions'
  
  private routes: Array<IRouteParams> = [
    { method: 'post', path: '/create', handler: this.controller.create , middleware: [auth] },
    { method: 'post', path: '/update/:id', handler: this.controller.update , middleware: [auth] },
    { method: 'post', path: '/delete/:id', handler: this.controller.delete , middleware: [auth] },
    { method: 'get', path: '/', handler: this.controller.list , middleware: [auth] },
    { method: 'get', path: '/:id', handler: this.controller.get , middleware: [auth] },
    { method: 'post', path: '/test', handler: this.controller.test , middleware: [auth] }
  ] 

  public init () {
    for (const path of this.routes) {
      this.routerUtility.route({
        method: path.method,
        path: path.path,
        handler: path.handler,
        middleware: path.middleware
      })
    }
  }
}

export { PredictionRoute }







