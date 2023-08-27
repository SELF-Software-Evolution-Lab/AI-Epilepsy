//@IMPORT: Libraries
import { Application } from "express"

//@IMPORT: Controllers
import { NotificationController } from "@app/controllers/notification/notificationController"

//@IMPORT: Utils
import { RouterUtility, IRouteParams } from "@core/routerUtility"


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
    { method: 'post', path: '/create', handler: this.controller.create , middleware: [] },
    { method: 'post', path: '/update/:id', handler: this.controller.update , middleware: [] },
    { method: 'post', path: '/delete/:id', handler: this.controller.delete , middleware: [] },
    { method: 'get', path: '/', handler: this.controller.list , middleware: [] },
    { method: 'get', path: '/:id', handler: this.controller.get , middleware: [] },
    { method: 'post', path: '/test', handler: this.controller.test , middleware: [] }
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







