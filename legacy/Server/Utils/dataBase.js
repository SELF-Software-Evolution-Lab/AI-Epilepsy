const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'epilepsy-mysql',
    user: 'root',
    database: 'ai_epilepsy',
    password: 'Pipemerca410*'
})

module.exports = pool.promise()