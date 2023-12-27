"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const NotificationModel = connection_1.default.define('Notification', {
    datetime: {
        type: sequelize_1.DataTypes.DATE,
    },
    message: {
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
    tableName: 'notifications',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.NotificationModel = NotificationModel;
(async () => {
    //await NotificationModel.sync();
})();
//# sourceMappingURL=notificationModel.js.map