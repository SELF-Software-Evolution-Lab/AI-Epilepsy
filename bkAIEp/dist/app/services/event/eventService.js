"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = exports.eventService = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const models_1 = require("../../models");
const sequelize_1 = require("sequelize");
class EventService {
    constructor() { }
    /**
    * Inserts or updates an event record based on the presence of 'id' in _params.
    * @param _params - Event parameters.
    * @returns Promise<{event: Event}> - Promise containing the event object.
    */
    async insertOrUpdate(_params) {
        try {
            if (_params.id) {
                // Update existing event
                const exists = await models_1.Event.findOne({ where: { id: _params.id } });
                // Update the event record
                if (!exists)
                    return responseUtility_1.responseUtility.error('event.not_found');
                // Retrieve and return the updated event
                const _event = await models_1.Event.update(_params, { where: { id: _params.id } });
                const event = await models_1.Event.findOne({ where: { id: _params.id } });
                return responseUtility_1.responseUtility.success({ event: event });
            }
            else {
                // Insert new event
                const _event = await models_1.Event.create(_params);
                const event = _event.toJSON();
                return responseUtility_1.responseUtility.success({ event });
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('event.insert_update.fail_action');
        }
    }
    /**
    * Retrieves a list of events based on the provided parameters.
    * @param _params - Query parameters for filtering events.
    * @returns Promise<{events: Event[]}> - Promise containing the list of events.
    */
    async list(_params) {
        try {
            const { page, number } = _params;
            const query = {
                where: {},
            };
            // Construct the query based on provided parameters
            if (_params.patient_id) {
                query.where['patient_id'] = {
                    [sequelize_1.Op.eq]: _params.patient_id
                };
            }
            if (page && number) {
                query['limit'] = number;
                query['offset'] = (page - 1) * number;
            }
            const events = await models_1.Event.findAll(query);
            return responseUtility_1.responseUtility.success({ events });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Deletes an event record based on the provided parameters.
    * @param _params - Parameters for identifying the event to be deleted.
    * @returns Promise<{event: Event}> - Promise containing the deleted event object.
    */
    async delete(_params) {
        try {
            // Check if the event exists
            const exists = await models_1.Event.findOne({ where: { id: _params.id } });
            // Delete the event record
            if (!exists)
                return responseUtility_1.responseUtility.error('event.not_found');
            // Return the deleted event
            await models_1.Event.destroy({ where: { id: _params.id } });
            return responseUtility_1.responseUtility.success({ event: exists });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('event.list.fail_action');
        }
    }
    /**
    * Retrieves details of a specific event based on the provided parameters.
    * @param _params - Parameters for identifying the event to be retrieved.
    * @returns Promise<{event: Event}> - Promise containing the retrieved event object.
    */
    async get(_params) {
        try {
            // Find the event based on the provided ID
            const event = await models_1.Event.findOne({ where: { id: _params.id } });
            // Return the retrieved event
            if (!event)
                return responseUtility_1.responseUtility.error('event.not_found');
            return responseUtility_1.responseUtility.success({ event });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('event.get.fail_action');
        }
    }
    /**
    * A placeholder method for testing purposes.
    * @param _params - Parameters for the test.
    * @returns Promise<void> - Promise indicating the success of the test.
    */
    async test(_params) {
        try {
            console.log('-------zadiaz:_params', _params);
            return responseUtility_1.responseUtility.success();
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.EventService = EventService;
exports.eventService = new EventService();
//# sourceMappingURL=eventService.js.map