import {Application} from 'express'

// @import_routes
import { PatientRoute } from '@app/routes/patientRoute'
import { EventRoute } from '@app/routes/eventRoute'
import { ExamRoute } from '@app/routes/examRoute'
import { NotificationRoute } from '@app/routes/notificationRoute'
import { PredictionRoute } from '@app/routes/predictionRoute'
import { FinderRoute } from '@app/routes/finderRoute'
import { AuthRoute } from '@app/routes/authRoute'


class Routes {
  
  private app: Application
  private prefix: string = '/api'
  
  // @declare_routes
  private patientRoute: PatientRoute
  private eventRoute: EventRoute
  private examRoute: ExamRoute
  private notificationRoute: NotificationRoute
  private predictionRoute: PredictionRoute
  private finderRoute: FinderRoute
  private authRoute: AuthRoute
  
  
  constructor(app: Application) {
    this.app = app
    
    // @assign_routes
    this.patientRoute = new PatientRoute(this.app, this.prefix)
    this.eventRoute = new EventRoute(this.app, this.prefix)
    this.examRoute = new ExamRoute(this.app, this.prefix)
    this.notificationRoute = new NotificationRoute(this.app, this.prefix)
    this.predictionRoute = new PredictionRoute(this.app, this.prefix)
    this.finderRoute = new FinderRoute(this.app, this.prefix)
    this.authRoute = new AuthRoute(this.app, this.prefix)
  }
  
  public init() {
    try{
      // @init_routes
      this.patientRoute.init()
      this.eventRoute.init()
      this.examRoute.init()
      this.notificationRoute.init()
      this.predictionRoute.init()
      this.finderRoute.init()
      this.authRoute.init()
      
      
    } catch (error) {
      console.log('error', error)
    }
  }
}

export { Routes }