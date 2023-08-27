import {   DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const PatientModel = db.define('Patient', {
  name: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'patients',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

(async () => {
  //await PatientModel.sync();
})();

export { PatientModel }