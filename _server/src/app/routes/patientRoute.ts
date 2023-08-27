//@IMPORT: Libraries
import { Application } from "express"

//@IMPORT: Controllers
import { PatientController } from "@app/controllers/patient/patientController"

//@IMPORT: Utils
import { RouterUtility, IRouteParams } from "@core/routerUtility"


class PatientRoute {

  private className:string = 'PatientRoute'  
  private app: Application
  private routerUtility: RouterUtility
  private controller: PatientController = new PatientController()
  
  constructor (app: Application, prefix: string) {
    this.app = app
    this.routerUtility = new RouterUtility(this.app, `${prefix}${this.prefix}`)
  }
  
  private prefix: string = '/patient'
  
  private routes: Array<IRouteParams> = [
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

export { PatientRoute }







