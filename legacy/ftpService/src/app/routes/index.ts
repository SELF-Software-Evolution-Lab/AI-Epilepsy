import { Application } from 'express'


class Routes {
  
  private app: Application
  private prefix: string = '/service'
  

  constructor(app: Application) {
    this.app = app
  }

  public init() {
    try{

      
    } catch (error) {
      console.log('error', error)
    }
  }
}

export { Routes }