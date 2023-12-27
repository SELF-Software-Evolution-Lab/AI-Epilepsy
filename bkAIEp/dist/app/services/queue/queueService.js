"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = exports.queueService = void 0;
const rabbitUtility_1 = require("../../../core/rabbitUtility");
const responseUtility_1 = require("../../../core/responseUtility");
const predictionService_1 = require("../../services/prediction/predictionService");
/**
* Service for managing queue.
* @class QueueService
*/
class QueueService {
    /**
    * Creates an instance of QueueService.
    * @memberof QueueService
    */
    constructor() {
    }
    /**
    * Sends a message to the outbound queue.
    * @param {string} message - The message to be sent.
    * @returns {Promise<Object>} A Promise containing the result of the operation.
    */
    async sendMessage(message) {
        try {
            // Get the channel for outbound communication
            const channel = await rabbitUtility_1.rabbitUtility.get_channel_outbound();
            // Send the message to the specified outbound queue
            channel.sendToQueue(rabbitUtility_1.OUTBOUND_QUEUE, Buffer.from(message));
            // Close the channel
            channel.close();
            return responseUtility_1.responseUtility.success({ message });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Connects to the inbound queue and sets up the message handler.
    * @returns {Promise<void>} A Promise that resolves when the connection is established.
    */
    async connect_inbound() {
        try {
            // Connect to the inbound channel with the provided message handler
            const channel = await rabbitUtility_1.rabbitUtility.connect_channel_inbound(this.onMessage);
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Message handler for processing inbound messages.
    * @param {any} message - The received message.
    * @returns {Promise<Object>} A Promise containing the result of the processing.
    */
    async onMessage(message) {
        try {
            // Parse the content of the message
            const content = JSON.parse(Buffer.from(message.content, "utf-8").toString());
            // Get prediction details based on the content
            const _prediction = await predictionService_1.predictionService.get({ id: content.prediction });
            // If the prediction retrieval fails, return the error response
            if (_prediction.code !== 200)
                return _prediction;
            // Extract prediction details
            const prediction = _prediction.prediction;
            //Updates prediction information
            const update = predictionService_1.predictionService.insertOrUpdate({
                id: prediction.id,
                result: content.result,
                label: 'Stopped'
            });
            // Return a success response
            return responseUtility_1.responseUtility.success();
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Gets the singleton instance of the QueueService.
    * @returns {QueueService} The singleton instance.
    */
    static getInstance() {
        try {
            // Create a new instance if it doesn't exist
            if (!QueueService.instance) {
                QueueService.instance = new QueueService();
            }
            return QueueService.instance;
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.QueueService = QueueService;
// Create and export the singleton instance of the QueueService
exports.queueService = QueueService.getInstance();
//# sourceMappingURL=queueService.js.map