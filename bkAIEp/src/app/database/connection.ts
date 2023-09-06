import {  config} from '@config/env'
import { Sequelize, Dialect } from 'sequelize'

const db = new Sequelize(config?.database?.connection?.database ? config.database.connection.database : 'test', config?.database?.connection?.username ? config.database.connection.username  :'root', config?.database?.connection?.password ? config.database.connection.password : '', {
  host: config?.database?.host ? config.database.host :'localhost',
  dialect: config?.database?.dialect ? config.database.dialect as Dialect : 'mysql',
  logging: config?.database?.logging ? config.database.logging : false,  
})

export default db