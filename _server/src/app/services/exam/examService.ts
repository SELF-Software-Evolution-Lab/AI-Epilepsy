

import { responseUtility } from "@core/responseUtility"
import { Exam } from '@app/models'

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
        const _exam = await Exam.create(_params)
        const exam = _exam.toJSON()
        return responseUtility.success({exam})
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
      
      return responseUtility.success()
    } catch (error) {
      console.log('error', error)
    }
  }

}

export const examService = new ExamService()
export { ExamService }