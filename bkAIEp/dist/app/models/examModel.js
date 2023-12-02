"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const ExamModel = connection_1.default.define('Exam', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    detail: {
        type: sequelize_1.DataTypes.STRING,
    },
    file: {
        type: sequelize_1.DataTypes.STRING,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
    },
    patient_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'patients',
            key: 'id'
        }
    }
}, {
    tableName: 'exams',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.ExamModel = ExamModel;
(async () => {
    //await ExamModel.sync();
})();
//# sourceMappingURL=examModel.js.map