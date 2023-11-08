import randomstring from 'randomstring'

import {responseUtility} from "@core/responseUtility"
import {Event, Exam} from '@app/models'
import {Op} from "sequelize"
import {finderService} from "@app/services/finder/finderService"
import moment from 'moment'
import fs from "node:fs";
import {ExamModel} from "@app/models/examModel";
import {ftpUtility} from "@core/ftpUtility";
import {v4 as unique} from 'uuid'


const PATH = '/home/ftpuser/public_html'
class ExamService {

  constructor () {}

  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        const exists = await Exam.findOne({ where: { id: _params.id } })
        if(!exists) return responseUtility.error('exam.not_found')
        const _exam = await Exam.update(_params, { where: { id: _params.id } })
        const exam = await Exam.findOne({ where: { id: _params.id } })
        return responseUtility.success({exam: exam})
      } else {

        if(!_params.source) return responseUtility.error('exam.insert_update.no_source')
        if(!_params.detail) return responseUtility.error('exam.insert_update.no_detail')
        if(!_params.file) return responseUtility.error('exam.insert_update.no_file')
        if(!_params.type) return responseUtility.error('exam.insert_update.no_type')
        if(!_params.patient_id) return responseUtility.error('exam.insert_update.no_patient_id')

        _params.type = _params.type.toLowerCase()

        const _r = randomstring.generate(7)
        const _n = _params.file.split('.')
        const new_name = `${_r}.${_n[_n.length -1]}`
        const path = `${PATH}/patient/${_params.patient_id}/${_params.type}`

        _params.path = `${path}/${new_name}`
        _params.file = new_name

        const transfer = await finderService.transfer({from: _params.source, to: path, file: new_name})
        if(transfer.status === 'error') return transfer

        const __event =   {
          detail: moment.utc().toISOString(),
          person: "Zadiaz",
          type: `Examen ${_params.type}`,
        }

        const _event = await Event.create(__event)
        const event = _event.toJSON()


        const _exam = await Exam.create(_params)
        const exam = _exam.toJSON()

        return responseUtility.success({exam, event})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.insert_update.fail_action')
    }
  }

  public async list (_params: any) {
    try{

      const { page, number } = _params

      const query = {
        where: {},
      }

      if(_params.patient_id){
        query.where['patient_id'] = {
          [Op.eq]: _params.patient_id
        }
      }

      if(_params.type){
        query.where['type'] = {
          [Op.eq]: _params.type.toUpperCase()
        }
      }

      if(page && number){
        query['limit'] = number
        query['offset'] = (page - 1) * number
      }

      const exams = await Exam.findAll(query)
      return responseUtility.success({exams})
    } catch (error) {
      console.log('error', error)
    }
  }

  public async delete (_params: any) {
    try{
      const exists = await Exam.findOne({ where: { id: _params.id } })
      if(!exists) return responseUtility.error('exam.not_found')
      await Exam.destroy({ where: { id: _params.id } })
      return responseUtility.success({exam: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.list.fail_action')
    }
  }

  public async get (_params: any) {
    try{
      const exam = await Exam.findOne({ where: { id: _params.id } })
      if(!exam) return responseUtility.error('exam.not_found')
      return responseUtility.success({exam})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.get.fail_action')
    }
  }

  public async test (_params: any) {
    try{

    } catch (error) {
      console.log('error', error)
    }
  }

  /**
   * Will check if the MRI test exists in cache folder. If so, will return a file_list.txt URL with a 200 OK response.
   * Otherwise, it will return a 202 Accepted response and commence the .zip retrieval
   * @param _params
   */
  async requestMRITest(_params: any) {
    try {
      const exam = await ExamModel.findOne({where: {id: _params.id}})
      if (!exam) return responseUtility.error('exam.not_found')

      const tempPath = exam.path.replace("{{EXAMID}}", exam.id.toString())
      const directory_exists = fs.existsSync(`temp/mri/${tempPath}`)
      if (directory_exists) {
        return responseUtility.success({tempPath}, 200)
      } else {
        const connection = _params.connection || unique()
        await ftpUtility.connect(connection)
        await ftpUtility.cd(connection, "/home/user/mri-exams", true)
        const lsResponse = await ftpUtility.ls(connection)
        const files = lsResponse.files
        let zipFileName = `user-${exam.patient_id}-exam-${exam.id}.zip`;
        if (files.find(e => e.name === zipFileName)) {
          if (!fs.existsSync(`temp/mri-download/${tempPath}`)) {
            fs.mkdirSync(`temp/mri-download/${tempPath}`, {recursive: true})
          }
          ftpUtility.downloadTo(connection, `temp/mri-download/${tempPath}/${zipFileName}`, `/home/user/mri-exams/${zipFileName}`)
          return responseUtility.success({tempPath}, 202)
        } else {
          return responseUtility.error('exam.mri.get.not_found')
        }
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.get.fail_action')
    }
  }
}

export const examService = new ExamService()
export { ExamService }