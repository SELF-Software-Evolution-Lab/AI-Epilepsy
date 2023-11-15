import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const UserModel = db.define('User', {
  username: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  position:{
    type: DataTypes.STRING
  },
  role_id:{
    type: DataTypes.INTEGER,
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

(async () => {
  //await UserModel.sync();
})();

export { UserModel }