import { Sequelize } from 'sequelize'

const db = new Sequelize('ai_epilepsy', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,  
})

export default db