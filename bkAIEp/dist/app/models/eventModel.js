"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const EventModel = connection_1.default.define('Event', {
    detail: {
        type: sequelize_1.DataTypes.STRING,
    },
    person: {
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
    tableName: 'events',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.EventModel = EventModel;
(async () => {
    //await EventModel.sync();
})();
//# sourceMappingURL=eventModel.js.map