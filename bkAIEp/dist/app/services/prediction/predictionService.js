"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionService = exports.predictionService = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const models_1 = require("../../models");
const sequelize_1 = require("sequelize");
const queueService_1 = require("../../services/queue/queueService");
class PredictionService {
    constructor() { }
    /**
    * Inserts or updates a prediction based on provided parameters.
    * @param {Object} _params - Object containing parameters for prediction insertion or update.
    * @returns {Promise<Object>} A Promise containing the result of the insertion or update operation.
    */
    async insertOrUpdate(_params) {
        try {
            // Check if an ID is provided; if true, update an existing prediction
            if (_params.id) {
                const exists = await models_1.Prediction.findOne({ where: { id: _params.id } });
                // If the prediction doesn't exist, return an error response
                if (!exists)
                    return responseUtility_1.responseUtility.error('prediction.not_found');
                // Update the existing prediction
                const _prediction = await models_1.Prediction.update(_params, { where: { id: _params.id } });
                // Retrieve the updated prediction
                const prediction = await models_1.Prediction.findOne({ where: { id: _params.id } });
                // Return a success response with the updated prediction
                return responseUtility_1.responseUtility.success({ prediction: prediction });
            }
            else {
                // If no ID is provided, create a new prediction
                // Check if at least one exam type is provided
                if (!_params.mri && !_params.arn && !_params.eeg)
                    return responseUtility_1.responseUtility.error('prediction.insert_update.need_at_least_a_exam');
                // Initialize an object to store exam data
                const _data = {};
                // Add MRI file to data if provided
                if (_params.mri && _params.mri.file) {
                    _data.mri = _params.mri.file;
                }
                // Add ARN file to data if provided
                if (_params.arn && _params.arn.file) {
                    _data.arn = _params.arn.file;
                }
                // Add EEG file to data if provided
                if (_params.eeg && _params.eeg.file) {
                    _data.eeg = _params.eeg.file;
                }
                // Create a new prediction with the provided data
                const _p = {
                    patient_id: _params.patient_id,
                    label: 'Requested',
                    result: 0,
                    prediction_data: JSON.stringify(_data)
                };
                // Insert the new prediction
                const _prediction = await models_1.Prediction.create(_p);
                // Retrieve the created prediction
                const prediction = _prediction.toJSON();
                // Update data with patient ID and prediction ID
                _data.patient_id = _params.patient_id,
                    _data.prediction = prediction.id;
                // If the prediction is created, send a message to the queue
                if (_prediction) {
                    await queueService_1.queueService.sendMessage(JSON.stringify(_data));
                }
                // Return a success response with the created prediction
                return responseUtility_1.responseUtility.success({ prediction });
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('prediction.insert_update.fail_action');
        }
    }
    /**
    * Retrieves a list of predictions based on provided parameters.
    * @param {Object} _params - Object containing parameters for prediction listing.
    * @returns {Promise<Object>} A Promise containing the list of predictions.
    */
    async list(_params) {
        try {
            // Extract page and number parameters for pagination
            const { page, number } = _params;
            // Initialize the query object with default values
            const query = {
                where: {},
            };
            // Add patient_id to the query if provided
            if (_params.patient_id) {
                query.where['patient_id'] = {
                    [sequelize_1.Op.eq]: _params.patient_id
                };
            }
            // Add pagination parameters to the query if provided
            if (page && number) {
                query['limit'] = number;
                query['offset'] = (page - 1) * number;
            }
            // Retrieve the list of predictions based on the query
            const predictions = await models_1.Prediction.findAll(query);
            // Return a success response with the list of predictions
            return responseUtility_1.responseUtility.success({ predictions });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Deletes a prediction based on the provided ID.
    * @param {Object} _params - Object containing the ID of the prediction to be deleted.
    * @returns {Promise<Object>} A Promise containing the result of the deletion operation.
    */
    async delete(_params) {
        try {
            // Check if the prediction with the provided ID exists
            const exists = await models_1.Prediction.findOne({ where: { id: _params.id } });
            // If the prediction doesn't exist, return an error response
            if (!exists)
                return responseUtility_1.responseUtility.error('prediction.not_found');
            // Delete the prediction with the provided ID
            await models_1.Prediction.destroy({ where: { id: _params.id } });
            // Return a success response with the deleted prediction
            return responseUtility_1.responseUtility.success({ prediction: exists });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('prediction.list.fail_action');
        }
    }
    /**
    * Retrieves a prediction based on the provided ID.
    * @param {Object} _params - Object containing the ID of the prediction to be retrieved.
    * @returns {Promise<Object>} A Promise containing the retrieved prediction.
    */
    async get(_params) {
        try {
            // Retrieve the prediction with the provided ID
            const prediction = await models_1.Prediction.findOne({ where: { id: _params.id } });
            // If the prediction doesn't exist, return an error response
            if (!prediction)
                return responseUtility_1.responseUtility.error('prediction.not_found');
            // Return a success response with the retrieved prediction
            return responseUtility_1.responseUtility.success({ prediction: prediction.dataValues });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('prediction.get.fail_action');
        }
    }
    /**
    * A test method that can be used for experimentation or development purposes.
    * @param {Object} _params - Parameters for the test method.
    * @returns {Promise<Object>} A Promise containing the result of the test operation.
    */
    async test(_params) {
        try {
            return responseUtility_1.responseUtility.success();
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.PredictionService = PredictionService;
// Create and export a singleton instance of the PredictionServic
exports.predictionService = new PredictionService();
//# sourceMappingURL=predictionService.js.map