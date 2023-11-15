//@IMPORT: Libraries
import {Application} from "express"

//@IMPORT: Controllers
import {ExamController} from "@app/controllers/exam/examController"

//@IMPORT: Utils
import {IRouteParams, RouterUtility} from "@core/routerUtility"


class ExamRoute {

  private className:string = 'ExamRoute'  
  private app: Application
  private routerUtility: RouterUtility
  private controller: ExamController = new ExamController()
  
  constructor (app: Application, prefix: string) {
    this.app = app
    this.routerUtility = new RouterUtility(this.app, `${prefix}${this.prefix}`)
  }
  
  private prefix: string = '/exams'
  
  private routes: Array<IRouteParams> = [
    { method: 'post', path: '/create', handler: this.controller.create , middleware: [] },
    { method: 'post', path: '/update/:id', handler: this.controller.update , middleware: [] },
    { method: 'post', path: '/delete/:id', handler: this.controller.delete , middleware: [] },
    { method: 'get', path: '/request-mri/:id', handler: this.controller.requestMRITest, middleware: []},
    { method: 'get', path: '/mri/:examID/:seriesID/file_list.*', handler: this.controller.requestMRIFileList, middleware: []},
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

export { ExamRoute }







