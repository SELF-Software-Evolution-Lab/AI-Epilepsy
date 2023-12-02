"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = exports.patientService = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const sequelize_1 = require("sequelize");
const models_1 = require("../../models");
class PatientService {
    constructor() { }
    /**
    * Inserts or updates a patient based on provided parameters.
    * @param {Object} _params - Object containing parameters for patient insertion or update.
    * @returns {Promise<Object>} A Promise containing the result of the insertion or update operation.
    */
    async insertOrUpdate(_params) {
        try {
            // Check if an ID is provided; if true, update an existing patient
            if (_params.id) {
                const exists = await models_1.Patient.findOne({ where: { id: _params.id } });
                // If the patient doesn't exist, return an error response
                if (!exists)
                    return responseUtility_1.responseUtility.error('patient.not_found');
                // Update the existing patient
                const _patient = await models_1.Patient.update(_params, { where: { id: _params.id } });
                // Retrieve the updated patient
                const patient = await models_1.Patient.findOne({ where: { id: _params.id } });
                // Return a success response with the updated patient
                return responseUtility_1.responseUtility.success({ patient: patient });
            }
            else {
                // If no ID is provided, create a new patient
                // Create a new patient
                const _patient = await models_1.Patient.create(_params);
                // Retrieve the created patient
                const patient = _patient.toJSON();
                // Return a success response with the created patient
                return responseUtility_1.responseUtility.success({ patient });
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('patient.insert_update.fail_action');
        }
    }
    /**
    * Retrieves a list of patients based on provided parameters.
    * @param {Object} _params - Object containing parameters for patient listing.
    * @returns {Promise<Object>} A Promise containing the list of patients.
    */
    async list(_params) {
        try {
            // Extract page and number parameters for pagination
            const { page, number } = _params;
            // Initialize the query object with default values
            const query = {
                where: {},
            };
            // Add search criteria to the query if provided
            if (_params.search) {
                query.where = {
                    ...query.where,
                    [sequelize_1.Op.or]: [
                        { first_name: { [sequelize_1.Op.like]: `%${_params.search}%` } },
                        { last_name: { [sequelize_1.Op.like]: `%${_params.search}%` } },
                        { email: { [sequelize_1.Op.like]: `%${_params.search}%` } },
                        { document_id: { [sequelize_1.Op.like]: `%${_params.search}%` } },
                        { blood_type: { [sequelize_1.Op.like]: `%${_params.search}%` } },
                        { emergency_contact_name: { [sequelize_1.Op.like]: `%${_params.search}%` } },
                        { emergency_contact_phone: { [sequelize_1.Op.like]: `%${_params.search}%` } },
                    ]
                };
            }
            // Add pagination parameters to the query if provided
            if (page && number) {
                query['limit'] = number;
                query['offset'] = (page - 1) * number;
            }
            // Retrieve the list of patients based on the query
            const patients = await models_1.Patient.findAll(query);
            // Return a success response with the list of patients
            return responseUtility_1.responseUtility.success({ patients });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Deletes a patient based on the provided ID.
    * @param {Object} _params - Object containing the ID of the patient to be deleted.
    * @returns {Promise<Object>} A Promise containing the result of the deletion operation.
    */
    async delete(_params) {
        try {
            // Check if the patient with the provided ID exists
            const exists = await models_1.Patient.findOne({ where: { id: _params.id } });
            // If the patient doesn't exist, return an error response
            if (!exists)
                return responseUtility_1.responseUtility.error('patient.not_found');
            // Delete the patient with the provided ID
            await models_1.Patient.destroy({ where: { id: _params.id } });
            // Return a success response with the deleted patient
            return responseUtility_1.responseUtility.success({ patient: exists });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('patient.list.fail_action');
        }
    }
    /**
    * Retrieves a patient based on the provided ID.
    * @param {Object} _params - Object containing the ID of the patient to be retrieved.
    * @returns {Promise<Object>} A Promise containing the retrieved patient.
    */
    async get(_params) {
        try {
            // Retrieve the patient with the provided ID
            const patient = await models_1.Patient.findOne({ where: { id: _params.id } });
            // If the patient doesn't exist, return an error response
            if (!patient)
                return responseUtility_1.responseUtility.error('patient.not_found');
            // Return a success response with the retrieved patient
            return responseUtility_1.responseUtility.success({ patient });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('patient.get.fail_action');
        }
    }
    /**
    * A test method that can be used for experimentation or development purposes.
    * @param {Object} _params - Parameters for the test method.
    * @returns {Promise<Object>} A Promise containing the result of the test operation.
    */
    async test(_params) {
        try {
            const patient = await models_1.Patient.create({ name: 'John' });
            const _response = {
                message: 'PatientService.test',
                _params
            };
            return responseUtility_1.responseUtility.success(_response);
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.PatientService = PatientService;
exports.patientService = new PatientService();
//# sourceMappingURL=patientService.js.map