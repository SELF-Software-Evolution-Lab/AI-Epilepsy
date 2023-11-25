"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.notificationService = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const models_1 = require("../../models");
class NotificationService {
    constructor() { }
    /**
    * Inserts or updates a notification based on provided parameters.
    * @param {Object} _params - Object containing parameters for notification insertion or update.
    * @returns {Promise<Object>} A Promise containing the result of the insertion or update operation.
    */
    async insertOrUpdate(_params) {
        try {
            // Check if an ID is provided; if true, update an existing notification
            if (_params.id) {
                const exists = await models_1.Notification.findOne({ where: { id: _params.id } });
                // If the notification doesn't exist, return an error response
                if (!exists)
                    return responseUtility_1.responseUtility.error('notification.not_found');
                // Update the existing notification
                const _notification = await models_1.Notification.update(_params, { where: { id: _params.id } });
                // Retrieve the updated notification
                const notification = await models_1.Notification.findOne({ where: { id: _params.id } });
                // Return a success response with the updated notification
                return responseUtility_1.responseUtility.success({ notification: notification });
            }
            else {
                // If no ID is provided, create a new notification
                // Create a new notification
                const _notification = await models_1.Notification.create(_params);
                // Retrieve the created notification
                const notification = _notification.toJSON();
                // Return a success response with the created notification
                return responseUtility_1.responseUtility.success({ notification });
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('notification.insert_update.fail_action');
        }
    }
    /**
    * Retrieves a list of notifications based on provided parameters.
    * @param {Object} _params - Object containing parameters for notification listing.
    * @returns {Promise<Object>} A Promise containing the list of notifications.
    */
    async list(_params) {
        try {
            // Extract page and number parameters for pagination
            const { page, number } = _params;
            // Initialize the query object with default values
            const query = {
                where: {},
            };
            // Add pagination parameters to the query if provided
            if (page && number) {
                query['limit'] = number;
                query['offset'] = (page - 1) * number;
            }
            // Retrieve the list of notifications based on the query
            const notifications = await models_1.Notification.findAll(query);
            // Return a success response with the list of notifications
            return responseUtility_1.responseUtility.success({ notifications });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Deletes a notification based on the provided ID.
    * @param {Object} _params - Object containing the ID of the notification to be deleted.
    * @returns {Promise<Object>} A Promise containing the result of the deletion operation.
    */
    async delete(_params) {
        try {
            // Check if the notification with the provided ID exists
            const exists = await models_1.Notification.findOne({ where: { id: _params.id } });
            // If the notification doesn't exist, return an error response
            if (!exists)
                return responseUtility_1.responseUtility.error('notification.not_found');
            // Delete the notification with the provided ID
            await models_1.Notification.destroy({ where: { id: _params.id } });
            // Return a success response with the deleted notification
            return responseUtility_1.responseUtility.success({ notification: exists });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('notification.list.fail_action');
        }
    }
    /**
    * Retrieves a notification based on the provided ID.
    * @param {Object} _params - Object containing the ID of the notification to be retrieved.
    * @returns {Promise<Object>} A Promise containing the retrieved notification.
    */
    async get(_params) {
        try {
            // Retrieve the notification with the provided ID
            const notification = await models_1.Notification.findOne({ where: { id: _params.id } });
            // If the notification doesn't exist, return an error response
            if (!notification)
                return responseUtility_1.responseUtility.error('notification.not_found');
            // Return a success response with the retrieved notification
            return responseUtility_1.responseUtility.success({ notification });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('notification.get.fail_action');
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
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=notificationService.js.map