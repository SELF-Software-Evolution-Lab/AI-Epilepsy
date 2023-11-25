"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitUtility = exports.rabbitUtility = exports.OUTBOUND_QUEUE = exports.INBOUND_QUEUE = void 0;
const env_1 = require("../config/env");
const amqplib_1 = __importDefault(require("amqplib"));
exports.INBOUND_QUEUE = 'my-predictions-anws';
exports.OUTBOUND_QUEUE = 'my-predictions';
/**
* Utility class for interacting with RabbitMQ.
* @class RabbitUtility
*/
class RabbitUtility {
    /**
    * Creates an instance of RabbitUtility.
    * @memberof RabbitUtility
    */
    constructor() {
        // Initialize RabbitMQ connection settings from the configuration
        this.settings = env_1.config.rabbit;
    }
    /**
    * Get the singleton instance of RabbitUtility.
    * @static
    * @memberof RabbitUtility
    * @returns {RabbitUtility} The RabbitUtility instance.
    */
    static getInstance() {
        try {
            // Check if the singleton instance already exists; if not, create a new instance.
            if (!RabbitUtility.instance) {
                RabbitUtility.instance = new RabbitUtility();
            }
            return RabbitUtility.instance;
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Establish a connection to RabbitMQ server.
    * @async
    * @memberof RabbitUtility
    * @returns {Promise<amqp.Connection>} A promise that resolves to the RabbitMQ connection.
    */
    async connect() {
        try {
            // Attempt to establish a connection to RabbitMQ using the specified settings.
            this.connection = await amqplib_1.default.connect(this.settings, {
                keepAlive: true,
                noDelay: true
            });
            // Create a channel after successfully establishing the connection.
            const channel = await this.connection.createChannel();
            return this.connection;
        }
        catch (error) {
            // Log any errors that occur during the connection process.
            console.log('error', error);
        }
    }
    /**
    * Get or create a channel for outbound communication.
    * @async
    * @memberof RabbitUtility
    * @returns {Promise<amqp.ChannelModel>} A promise that resolves to the outbound channel.
    */
    async get_channel_outbound() {
        try {
            // If a connection does not exist, attempt to establish one.
            if (!this.connection)
                await this.connect();
            // Create a new channel and assert the existence of the outbound queue.
            const channel = await this.connection.createChannel();
            await channel.assertQueue(exports.OUTBOUND_QUEUE, {});
            // Set the outbound channel for future use.
            this.channel_outbound = channel;
            return channel;
        }
        catch (error) {
            // Log any errors that occur during the channel creation process.
            console.log('error', error);
        }
    }
    /**
    * Connect a channel for inbound communication with a message listener.
    * @async
    * @memberof RabbitUtility
    * @param {Function} listener - The message listener function.
    * @returns {Promise<amqp.ChannelModel>} A promise that resolves to the inbound channel.
    */
    async connect_channel_inbound(listener) {
        try {
            // If a connection does not exist, attempt to establish one.
            if (!this.connection)
                await this.connect();
            // Create a new channel and assert the existence of the inbound queue.
            const channel = await this.connection.createChannel();
            await channel.assertQueue(exports.INBOUND_QUEUE, {});
            // Set the inbound channel for future use and start consuming messages with the provided listener.
            this.channel_inbound = channel;
            channel.consume(exports.INBOUND_QUEUE, listener, { noAck: true });
            return channel;
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.RabbitUtility = RabbitUtility;
exports.rabbitUtility = RabbitUtility.getInstance();
//# sourceMappingURL=rabbitUtility.js.map