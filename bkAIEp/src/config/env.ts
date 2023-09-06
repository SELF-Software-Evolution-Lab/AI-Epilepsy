export const config = {
  mode: 'dev',
  database:{
    sync:{
      force: true
    },
    host: 'localhost',
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
    hostname: "34.125.50.123",
    port: "5672",
    username: "epilepsy_user",
    password: "ep123",
    vhost: "/"
  },
  ftp:{
    logger: true,
    connections: [
      {
        key: "client",
        host: "52.40.236.165",
        user: "ftpuser",
        password: "123456",
        port: 21,
        secure: false
      }
    ]
  }
}