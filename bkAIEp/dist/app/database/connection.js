"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../../config/env");
const sequelize_1 = require("sequelize");
// Create a Sequelize instance for the database connection
const db = new sequelize_1.Sequelize(
// Use values from the configuration, or defaults if not provided
env_1.config?.database?.connection?.database ? env_1.config.database.connection.database : 'test', env_1.config?.database?.connection?.username ? env_1.config.database.connection.username : 'root', env_1.config?.database?.connection?.password ? env_1.config.database.connection.password : '', {
    host: env_1.config?.database?.host ? env_1.config.database.host : 'localhost',
    dialect: env_1.config?.database?.dialect ? env_1.config.database.dialect : 'mysql',
    logging: env_1.config?.database?.logging ? env_1.config.database.logging : false,
});
// Export the Sequelize instance for database connection
exports.default = db;
//# sourceMappingURL=connection.js.map