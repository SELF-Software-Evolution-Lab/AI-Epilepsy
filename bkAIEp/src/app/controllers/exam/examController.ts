import {Request, Response} from 'express'
import {responseUtility} from '@core/responseUtility'
import {ExamService} from '@app/services/exam/examService'

class ExamController {


  private service = new ExamService()

  constructor () {}


  public create = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.insertOrUpdate(_params)
    return responseUtility.build(res, response)
  }

  public update = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.insertOrUpdate(_params)
    return responseUtility.build(res, response)
  }

  public requestMRITest = async (req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.requestMRITest(_params)
    return responseUtility.build(res, response)
  }

  public list = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.list(_params)
    return responseUtility.build(res, response)
  }

  public delete = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.delete(_params)
    return responseUtility.build(res, response)
  }

  public get = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.get(_params)
    return responseUtility.build(res, response)
  }

  public test = async(req: Request, res: Response) => {
    const _params = req._data()
    const response = await this.service.test(_params)
    return responseUtility.build(res, response)
  }

  public requestMRIFileList = async (req: Request, res: Response) => {
      const _params = req._data()
      const response = await this.service.requestMRIFileList(_params)
      if (response.deliver_list){
        res.set({"Content-Disposition": "attachment; filename=\"file_list.txt\""});
        res.send(response.files.join('\n'));
      }else{
        return responseUtility.build(res, response)
      }
    }

    public requestMRIFile = async (req: Request, res: Response) => {
        const _params = req._data()
        const response = await this.service.requestMRIFile(_params)
        if (response.deliver_file) {
            res.setHeader('content-type', 'application/dicom');
            return res.sendFile(response.file, {root: './'});
        }
        return responseUtility.build(res, response)
    }
}


export const examController = new ExamController()
export { ExamController }