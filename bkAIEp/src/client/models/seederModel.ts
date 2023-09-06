
import {  DataTypes } from 'sequelize';
import db from "@app/database/connection"

const SeederModel = db.define('Seeder', {
  seeder: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'seeders',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

(async () => {
  await SeederModel.sync();
})();

export { SeederModel }