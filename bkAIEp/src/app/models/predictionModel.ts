import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const PredictionModel = db.define('Prediction', {
  patient_id:{
    type: DataTypes.INTEGER,
    references: {
      model: 'patients',
      key: 'id'
    }
  },
  label:{
    type: DataTypes.STRING,
  },
  result:{
    type: DataTypes.INTEGER,
  },
  prediction_data:{
    type: DataTypes.STRING,
  },
  eeg_data:{
    type: DataTypes.JSON,
  },
  mri_data:{
    type: DataTypes.JSON,
  },
  arn_data:{
    type: DataTypes.JSON,
  }
}, {
  tableName: 'predictions',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

(async () => {
  //await PredictionModel.sync();
})();

export { PredictionModel }