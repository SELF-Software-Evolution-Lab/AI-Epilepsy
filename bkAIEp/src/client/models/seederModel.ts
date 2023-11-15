// Import Sequelize DataTypes and the database connection
import { DataTypes } from 'sequelize';
import db from "@app/database/connection";

// Define the SeederModel using Sequelize's define method
const SeederModel = db.define('Seeder', {
  // Define a 'seeder' field with a STRING data type, and disallow null values
  seeder: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Additional configuration options for the model
  tableName: 'seeders',          // Define the table name for the model
  createdAt: 'created_at',       // Map 'created_at' column to createdAt property
  updatedAt: 'updated_at'        // Map 'updated_at' column to updatedAt property
});

// Immediately invoke an async function to synchronize the model with the database
(async () => {
  await SeederModel.sync();
})();

// Export the SeederModel for use in other parts of the application
export { SeederModel };