import randomstring from 'randomstring'

import { responseUtility } from "@core/responseUtility"
import { Event, Exam } from '@app/models'
import { Op } from "sequelize"
import { finderService } from "@app/services/finder/finderService"
import moment from 'moment'


const PATH = '/home/ftpuser/public_html'
class ExamService {
  
  constructor () {}
  
  /**
  * Inserts or updates an exam record based on the presence of 'id' in _params.
  * @param _params - Exam parameters.
  * @returns Promise<{exam: Exam}> - Promise containing the exam object.
  */
  public async insertOrUpdate (_params: any) {
    try{
      if(_params.id){
        // Update existing exam
        const exists = await Exam.findOne({ where: { id: _params.id } })
        if(!exists) return responseUtility.error('exam.not_found')
        const _exam = await Exam.update(_params, { where: { id: _params.id } })
        const exam = await Exam.findOne({ where: { id: _params.id } })
        return responseUtility.success({exam: exam})
      } else {
        // Insert new exam
        if(_params.type === 'mri' || _params.type === 'arn'   || _params.type === 'eeg'){
          // Validate required fields for specific exam types
          if(!_params.source) return responseUtility.error('exam.insert_update.no_source')
          if(!_params.detail) return responseUtility.error('exam.insert_update.no_detail')
          if(!_params.file) return responseUtility.error('exam.insert_update.no_file')
          if(!_params.type) return responseUtility.error('exam.insert_update.no_type')
          if(!_params.patient_id) return responseUtility.error('exam.insert_update.no_patient_id')
          
          // Convert exam type to lowercase
          _params.type = _params.type.toLowerCase()
          
          // Generate a random string for the file name
          const _r = randomstring.generate(7)
          const _n = _params.file.split('.')
          const new_name = `${_r}.${_n[_n.length -1]}`
          const path = `${PATH}/patient/${_params.patient_id}/${_params.type}`
          
          // Update file path and name in the exam parameters
          _params.path = `${path}/${new_name}`
          _params.file = new_name
          
          // Transfer the file to the specified path
          const transfer = await finderService.transfer({from: _params.source, to: path, file: new_name})
          if(transfer.status === 'error') return transfer
        }
        
        // Create an event for the new exam
        const __event =   {
          detail: moment.utc().toISOString(),
          person: "Zadiaz",
          type: `Examen ${_params.type}`,
        }
        
        // Save the event to the database
        const _event = await Event.create(__event)
        const event = _event.toJSON()
        
        // Create the exam record
        const _exam = await Exam.create(_params)
        const exam = _exam.toJSON()
        
        return responseUtility.success({exam, event})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.insert_update.fail_action')
    }
  }
  
  /**
  * Retrieves a list of exams based on the provided parameters.
  * @param _params - Query parameters for filtering exams.
  * @returns Promise<{exams: Exam[]}> - Promise containing the list of exams.
  */
  public async list (_params: any) {
    try{
      
      const { page, number } = _params
      // Construct the query based on provided parameters
      const query:any = {
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
  
  /**
  * Deletes an exam record based on the provided parameters.
  * @param _params - Parameters for identifying the exam to be deleted.
  * @returns Promise<{exam: Exam}> - Promise containing the deleted exam object.
  */
  public async delete (_params: any) {
    try{
      // Check if the exam exists
      const exists = await Exam.findOne({ where: { id: _params.id } })
      // Delete the exam record
      if(!exists) return responseUtility.error('exam.not_found')
      await Exam.destroy({ where: { id: _params.id } })
      // Return the deleted exam
      return responseUtility.success({exam: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('exam.list.fail_action')
    }
  }
  
  /**
  * Retrieves details of a specific exam based on the provided parameters.
  * @param _params - Parameters for identifying the exam to be retrieved.
  * @returns Promise<{exam: Exam}> - Promise containing the retrieved exam object.
  */
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

  /**
  * A placeholder method for testing purposes.
  * @param _params - Parameters for the test.
  */
  public async test (_params: any) {
    try{
      
    } catch (error) {
      console.log('error', error)
    }
  }
  
}

export const examService = new ExamService()
export { ExamService }