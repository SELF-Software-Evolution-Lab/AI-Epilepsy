export const config = {
  mode: 'dev',
  database:{
    sync:{
      force: false
    },
    host: '172.24.100.64',
    dialect: 'mysql',
    logging: false,
    connection:{
      database: 'ai_epilepsy',
      username: 'root',
      password: '',
    },
  },
  rabbit:{
    protocol: "amqp",
    hostname: "localhost",
    port: "5672",
    username: "amqpuser",
    password: "ai_epilepsy10*",
    vhost: "/"
  },
  ftp:{
    logger: true,
    connections: [
      {
        key: "homi",
        host: "52.40.236.165",
        user: "ftpuser",
        password: "123456",
        port: 21,
        secure: false
      }
    ]
  },
  jwt: 'secret'
}