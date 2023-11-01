//@IMPORT: Libraries
import { Application } from "express"

//@IMPORT: Controllers
import { FinderController } from "@app/controllers/finder/finderController"

//@IMPORT: Utils
import { RouterUtility, IRouteParams } from "@core/routerUtility"


class FinderRoute {

  private className:string = 'FinderRoute'  
  private app: Application
  private routerUtility: RouterUtility
  private controller: FinderController = new FinderController()
  
  constructor (app: Application, prefix: string) {
    this.app = app
    this.routerUtility = new RouterUtility(this.app, `${prefix}${this.prefix}`)
  }
  
  private prefix: string = '/finder'
  
  private routes: Array<IRouteParams> = [
    { method: 'post', path: '/test', handler: this.controller.test , middleware: [] },
    { method: 'post', path: '/tree', handler: this.controller.tree , middleware: [] },
    { method: 'post', path: '/go-to', handler: this.controller.goTo , middleware: [] },
    { method: 'post', path: '/transfer', handler: this.controller.transfer , middleware: [] }
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

export { FinderRoute }







