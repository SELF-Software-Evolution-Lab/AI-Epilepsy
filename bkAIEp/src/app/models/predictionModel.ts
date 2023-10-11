import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const PredictionModel = db.define('Prediction', {
  date_requested:{
    type: DataTypes.DATE,
  },
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