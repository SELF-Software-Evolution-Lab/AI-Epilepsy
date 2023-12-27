"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const PermissionModel = connection_1.default.define('Permission', {
    module: {
        type: sequelize_1.DataTypes.STRING
    },
    access: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: 'permissions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.PermissionModel = PermissionModel;
(async () => {
    //await PermissionModel.sync();
})();
//# sourceMappingURL=permissionModel.js.map