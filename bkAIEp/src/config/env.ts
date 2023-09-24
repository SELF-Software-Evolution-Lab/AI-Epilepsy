export const config = {
  mode: 'dev',
  database:{
    sync:{
      force: false
    },
    host: '172.16.238.10',
    dialect: 'mysql',
    logging: false,
    connection:{
      database: 'ai_epilepsy',
      username: 'root',
      password: 'ai_epilepsy10*',
    },
  },
  rabbit:{
    protocol: "amqp",
    hostname: "172.16.238.13",
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
        host: "172.16.238.12",
        user: "ftpuser",
        password: "ai_epilepsy10*",
        port: 21,
        secure: false
      }
    ]
  }
}