"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const PredictionModel = connection_1.default.define('Prediction', {
    patient_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'patients',
            key: 'id'
        }
    },
    label: {
        type: sequelize_1.DataTypes.STRING,
    },
    result: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    prediction_data: {
        type: sequelize_1.DataTypes.STRING,
    },
    eeg_data: {
        type: sequelize_1.DataTypes.JSON,
    },
    mri_data: {
        type: sequelize_1.DataTypes.JSON,
    },
    arn_data: {
        type: sequelize_1.DataTypes.JSON,
    }
}, {
    tableName: 'predictions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.PredictionModel = PredictionModel;
(async () => {
    //await PredictionModel.sync();
})();
//# sourceMappingURL=predictionModel.js.map