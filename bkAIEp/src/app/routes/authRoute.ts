//@IMPORT: Libraries
import { Application } from "express"

//@IMPORT: Controllers
import { AuthController } from "@app/controllers/auth/authController"

//@IMPORT: Utils
import { RouterUtility, IRouteParams } from "@core/routerUtility"


class AuthRoute {
  
  private className:string = 'AuthRoute'  
  private app: Application
  private routerUtility: RouterUtility
  private controller: AuthController = new AuthController()
  
  constructor (app: Application, prefix: string) {
    this.app = app
    this.routerUtility = new RouterUtility(this.app, `${prefix}${this.prefix}`)
  }
  
  // Prefix for authentication routes
  private prefix: string = '/auth'
  
  // Array of route parameters for authentication routes
  private routes: Array<IRouteParams> = [
    { method: 'post', path: '/login', handler: this.controller.login , middleware: [] },
    { method: 'post', path: '/sign-up', handler: this.controller.signUp , middleware: [] }
  ] 
  
  /**
  * Initializes authentication routes by defining each route with its corresponding handler and middleware.
  */
  public init () {
    for (const path of this.routes) {
      // Define each route using the RouterUtility
      this.routerUtility.route({
        method: path.method,
        path: path.path,
        handler: path.handler,
        middleware: path.middleware
      })
    }
  }
}

export { AuthRoute }







