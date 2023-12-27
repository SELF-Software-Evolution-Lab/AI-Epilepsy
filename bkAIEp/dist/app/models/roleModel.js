"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const permissionModel_1 = require("../models/permissionModel");
const RoleModel = connection_1.default.define('Role', {
    name: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: 'roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.RoleModel = RoleModel;
(async () => {
    //await RoleModel.sync();
})();
permissionModel_1.PermissionModel.belongsToMany(RoleModel, { through: 'role_permission' });
RoleModel.belongsToMany(permissionModel_1.PermissionModel, { through: 'role_permission' });
//# sourceMappingURL=roleModel.js.map