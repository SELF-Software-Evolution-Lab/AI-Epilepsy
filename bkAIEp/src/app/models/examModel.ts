import { DataTypes } from 'sequelize';
import  db  from "@app/database/connection";

const ExamModel = db.define('Exam', {
  datetime: {
    type: DataTypes.DATE,
  },
  detail: {
    type: DataTypes.STRING,
  },
  file:{
    type: DataTypes.STRING,
  },
  path:{
    type: DataTypes.STRING,
  },
  type:{
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
  tableName: 'exams',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

(async () => {
  //await ExamModel.sync();
})();

export { ExamModel }