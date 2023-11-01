import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';
import db from "@app/database/connection";

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  detail: string;
  file: string;
  path: string;
  type: string;
  patient_id: string;
}

const ExamModel = db.define<UserModel>('Exam', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
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