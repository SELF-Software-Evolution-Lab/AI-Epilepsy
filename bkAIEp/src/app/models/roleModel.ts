import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";
import { PermissionModel } from '@app/models/permissionModel';

const RoleModel = db.define('Role', {
  name:{
    type: DataTypes.STRING
  }
}, {
  tableName: 'roles',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

(async () => {
  //await RoleModel.sync();
})();

PermissionModel.belongsToMany(RoleModel, { through: 'role_permission' })
RoleModel.belongsToMany(PermissionModel, { through: 'role_permission' })

export { RoleModel }