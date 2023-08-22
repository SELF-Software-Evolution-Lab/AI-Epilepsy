const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'epilepsy-mysql',
    user: 'root',
    database: 'Ai-Epilepsy',
    password: 'Pipemerca410*'
})

module.exports = pool.promise()