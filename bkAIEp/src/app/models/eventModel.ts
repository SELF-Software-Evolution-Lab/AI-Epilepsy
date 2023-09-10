import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const EventModel = db.define('Event', {
  datetime: {
    type: DataTypes.DATE,
  },
  detail: {
    type: DataTypes.STRING,
  },
  format:{
    type: DataTypes.STRING,
  },
  file:{
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
  tableName: 'events',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

(async () => {
  //await EventModel.sync();
})();

export { EventModel }