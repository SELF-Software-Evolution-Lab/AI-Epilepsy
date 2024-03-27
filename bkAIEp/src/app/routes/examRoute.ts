//@IMPORT: Libraries
import {Application} from "express"

//@IMPORT: Controllers
import {ExamController} from "@app/controllers/exam/examController"

//@IMPORT: Utils
import {IRouteParams, RouterUtility} from "@core/routerUtility"
import { request as auth } from "@app/middleware/authMiddleware"

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
    { method: 'post', path: '/create', handler: this.controller.create , middleware: [auth]  },
    { method: 'post', path: '/update/:id', handler: this.controller.update , middleware: [auth]  },
    { method: 'post', path: '/delete/:id', handler: this.controller.delete , middleware: [auth]  },
    { method: 'get', path: '/request-mri/:id', handler: this.controller.requestMRITest, middleware: [auth] },
    { method: 'get', path: '/mri/:examID/:seriesID/file_list.*', handler: this.controller.requestMRIFileList, middleware: [] }, //TODO fix authentication in these endpoints
    { method: 'get', path: '/mri/:examID/:seriesID/:filename', handler: this.controller.requestMRIFile, middleware: [] }, //TODO fix authentication in these endpoints
    { method: 'post', path: '/', handler: this.controller.list , middleware: [auth]  },
    { method: 'get', path: '/:id', handler: this.controller.get , middleware: [auth]  },
    { method: 'post', path: '/test', handler: this.controller.test , middleware: [auth]  }
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







