import {   DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const PatientModel = db.define('Patient', {
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  gender:{
    type: DataTypes.STRING,
  },
  blood_type:{
    type: DataTypes.STRING,
  },
  email:{ 
    type: DataTypes.STRING,
  },
  emergency_contact_name:{
    type: DataTypes.STRING,
  },
  emergency_contact_phone:{
    type: DataTypes.STRING,
  },
  document_id:{
    type: DataTypes.BIGINT,
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