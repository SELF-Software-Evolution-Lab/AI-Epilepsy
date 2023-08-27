import {Application} from 'express'
import { PatientRoute } from '@app/routes/patientRoute'


class Routes {
  
  private app: Application
  private prefix: string = '/api'
  private patientRoute: PatientRoute
  
  constructor(app: Application) {
    this.app = app
    this.patientRoute = new PatientRoute(this.app, this.prefix)
  }

  public init() {
    try{
      
      this.patientRoute.init()
      
    } catch (error) {
      console.log('error', error)
    }
  }
}

export { Routes }