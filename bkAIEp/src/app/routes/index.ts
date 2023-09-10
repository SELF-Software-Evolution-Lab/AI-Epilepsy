import {Application} from 'express'
import { PatientRoute } from '@app/routes/patientRoute'
import { EventRoute } from '@app/routes/eventRoute'
import { ExamRoute } from '@app/routes/examRoute'
import { NotificationRoute } from '@app/routes/notificationRoute'
import { PredictionRoute } from '@app/routes/predictionRoute'


class Routes {
  
  private app: Application
  private prefix: string = '/api'
  private patientRoute: PatientRoute
  private eventRoute: EventRoute
  private examRoute: ExamRoute
  private notificationRoute: NotificationRoute
  private predictionRoute: PredictionRoute
  

  constructor(app: Application) {
    this.app = app
    this.patientRoute = new PatientRoute(this.app, this.prefix)
    this.eventRoute = new EventRoute(this.app, this.prefix)
    this.examRoute = new ExamRoute(this.app, this.prefix)
    this.notificationRoute = new NotificationRoute(this.app, this.prefix)
    this.predictionRoute = new PredictionRoute(this.app, this.prefix)

  }

  public init() {
    try{

      this.patientRoute.init()
      this.eventRoute.init()
      this.examRoute.init()
      this.notificationRoute.init()
      this.predictionRoute.init()

      
    } catch (error) {
      console.log('error', error)
    }
  }
}

export { Routes }