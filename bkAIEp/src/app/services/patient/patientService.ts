

import { responseUtility } from "@core/responseUtility"
import { Op } from "sequelize"
import { Patient } from '@app/models'

class PatientService {
  
  constructor () {}
  
  /**
  * Inserts or updates a patient based on provided parameters.
  * @param {Object} _params - Object containing parameters for patient insertion or update.
  * @returns {Promise<Object>} A Promise containing the result of the insertion or update operation.
  */
  public async insertOrUpdate (_params: any) {
    try{
      // Check if an ID is provided; if true, update an existing patient
      if(_params.id){
        const exists = await Patient.findOne({ where: { id: _params.id } })
        // If the patient doesn't exist, return an error response
        if(!exists) return responseUtility.error('patient.not_found')
        // Update the existing patient
        const _patient = await Patient.update(_params, { where: { id: _params.id } })
        // Retrieve the updated patient
        const patient = await Patient.findOne({ where: { id: _params.id } })
        // Return a success response with the updated patient
        return responseUtility.success({patient: patient})
      } else {
        // If no ID is provided, create a new patient
        
        // Create a new patient
        const _patient = await Patient.create(_params)
        
        // Retrieve the created patient
        const patient = _patient.toJSON()
        // Return a success response with the created patient
        return responseUtility.success({patient})
      }
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('patient.insert_update.fail_action')
    }
  }
  
  /**
  * Retrieves a list of patients based on provided parameters.
  * @param {Object} _params - Object containing parameters for patient listing.
  * @returns {Promise<Object>} A Promise containing the list of patients.
  */
  public async list (_params: any) {
    try{
      // Extract page and number parameters for pagination
      const { page, number } = _params
      
      // Initialize the query object with default values
      const query = {
        where: {},
      }
      
      // Add search criteria to the query if provided
      if(_params.search){
        query.where = {
          ...query.where,
          [Op.or]: [
            { first_name: { [Op.like]: `%${_params.search}%` } },
            { last_name: { [Op.like]: `%${_params.search}%` } },
            { email: { [Op.like]: `%${_params.search}%` } },
            { document_id: { [Op.like]: `%${_params.search}%` } },
            { blood_type: { [Op.like]: `%${_params.search}%` } },
            { emergency_contact_name: { [Op.like]: `%${_params.search}%` } },
            { emergency_contact_phone: { [Op.like]: `%${_params.search}%` } },
          ]
        }
      }
      
      // Add pagination parameters to the query if provided
      if(page && number){
        query['limit'] = number
        query['offset'] = (page - 1) * number
      }
      
      // Retrieve the list of patients based on the query
      const patients = await Patient.findAll(query)
      
      // Return a success response with the list of patients
      return responseUtility.success({patients})
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Deletes a patient based on the provided ID.
  * @param {Object} _params - Object containing the ID of the patient to be deleted.
  * @returns {Promise<Object>} A Promise containing the result of the deletion operation.
  */
  public async delete (_params: any) {
    try{
      // Check if the patient with the provided ID exists
      const exists = await Patient.findOne({ where: { id: _params.id } })
      // If the patient doesn't exist, return an error response
      if(!exists) return responseUtility.error('patient.not_found')
      // Delete the patient with the provided ID
      await Patient.destroy({ where: { id: _params.id } })
      // Return a success response with the deleted patient
      return responseUtility.success({patient: exists})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('patient.list.fail_action')
    }
  }
  
  /**
  * Retrieves a patient based on the provided ID.
  * @param {Object} _params - Object containing the ID of the patient to be retrieved.
  * @returns {Promise<Object>} A Promise containing the retrieved patient.
  */
  public async get (_params: any) {
    try{
      // Retrieve the patient with the provided ID
      const patient = await Patient.findOne({ where: { id: _params.id } })
      // If the patient doesn't exist, return an error response
      if(!patient) return responseUtility.error('patient.not_found')
      // Return a success response with the retrieved patient
      return responseUtility.success({patient})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('patient.get.fail_action')
    }
  }
  
  /**
  * A test method that can be used for experimentation or development purposes.
  * @param {Object} _params - Parameters for the test method.
  * @returns {Promise<Object>} A Promise containing the result of the test operation.
  */
  public async test (_params: any) {
    try{
      const patient = await Patient.create({ name: 'John' })
      const _response = {
        message: 'PatientService.test',
        _params
      }
      return responseUtility.success(_response)
    } catch (error) {
      console.log('error', error)
    }
  }
  
}

export const patientService = new PatientService()
export { PatientService }