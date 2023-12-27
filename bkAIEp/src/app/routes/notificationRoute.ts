//@IMPORT: Libraries
import { Application } from "express"

//@IMPORT: Controllers
import { NotificationController } from "@app/controllers/notification/notificationController"

//@IMPORT: Utils
import { RouterUtility, IRouteParams } from "@core/routerUtility"
import { request as auth } from "@app/middleware/authMiddleware"

class NotificationRoute {

  private className:string = 'NotificationRoute'  
  private app: Application
  private routerUtility: RouterUtility
  private controller: NotificationController = new NotificationController()

  
  
  constructor (app: Application, prefix: string) {
    this.app = app
    this.routerUtility = new RouterUtility(this.app, `${prefix}${this.prefix}`)
  }
  
  private prefix: string = '/notifications'
  
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

export { NotificationRoute }







