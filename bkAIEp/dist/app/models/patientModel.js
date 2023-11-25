"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const PatientModel = connection_1.default.define('Patient', {
    first_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
    },
    blood_type: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    emergency_contact_name: {
        type: sequelize_1.DataTypes.STRING,
    },
    emergency_contact_phone: {
        type: sequelize_1.DataTypes.STRING,
    },
    document_id: {
        type: sequelize_1.DataTypes.BIGINT,
    }
}, {
    tableName: 'patients',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.PatientModel = PatientModel;
(async () => {
    //await PatientModel.sync();
})();
//# sourceMappingURL=patientModel.js.map