import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const PermissionModel = db.define('Permission', {
  module: {
    type: DataTypes.STRING
  },
  access:{
    type: DataTypes.STRING
  }
}, {
  tableName: 'permissions',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

(async () => {
  //await PermissionModel.sync();
})();




export { PermissionModel }