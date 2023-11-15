import {  config} from '@config/env'
import { Sequelize, Dialect } from 'sequelize'


// Create a Sequelize instance for the database connection
const db = new Sequelize(
  // Use values from the configuration, or defaults if not provided
  config?.database?.connection?.database ? config.database.connection.database : 'test', config?.database?.connection?.username ? config.database.connection.username  :'root', config?.database?.connection?.password ? config.database.connection.password : '', {
    host: config?.database?.host ? config.database.host :'localhost',
    dialect: config?.database?.dialect ? config.database.dialect as Dialect : 'mysql',
    logging: config?.database?.logging ? config.database.logging : false,  
  })
  
  // Export the Sequelize instance for database connection
  export default db