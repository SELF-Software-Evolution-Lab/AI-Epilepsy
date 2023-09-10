import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const NotificationModel = db.define('Notification', {
  datetime: {
    type: DataTypes.DATE,
  },
  message: {
    type: DataTypes.STRING,
  },
  patient_id:{
    type: DataTypes.INTEGER,
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

(async () => {
  //await NotificationModel.sync();
})();

export { NotificationModel }