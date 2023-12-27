"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModel = void 0;
// Import Sequelize DataTypes and the database connection
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../../app/database/connection"));
// Define the SeederModel using Sequelize's define method
const SeederModel = connection_1.default.define('Seeder', {
    // Define a 'seeder' field with a STRING data type, and disallow null values
    seeder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    // Additional configuration options for the model
    tableName: 'seeders', // Define the table name for the model
    createdAt: 'created_at', // Map 'created_at' column to createdAt property
    updatedAt: 'updated_at' // Map 'updated_at' column to updatedAt property
});
exports.SeederModel = SeederModel;
// Immediately invoke an async function to synchronize the model with the database
(async () => {
    await SeederModel.sync();
})();
//# sourceMappingURL=seederModel.js.map