"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const UserModel = connection_1.default.define('User', {
    username: {
        type: sequelize_1.DataTypes.STRING
    },
    password: {
        type: sequelize_1.DataTypes.STRING
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING
    },
    position: {
        type: sequelize_1.DataTypes.STRING
    },
    role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'id'
        }
    }
}, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.UserModel = UserModel;
(async () => {
    //await UserModel.sync();
})();
//# sourceMappingURL=userModel.js.map