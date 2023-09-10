import express from "express"
import { Sequelize } from 'sequelize'
import cors from "cors"
import { config as env } from "@config/env"
import morgan from 'morgan'
import chalk from 'chalk'


import { Routes } from "@app/routes"

import { request as request_mw } from "@app/middleware/requestMiddleware"
import db from "@app/database/connection"


class App {

  private app: express.Application
  private routes: Routes
  private dataBase: Sequelize

  constructor() {
    this.app = express()
    this.routes = new Routes(this.app)
    this.dataBase = db
  }

  public async init() {
    if(!global.env) global.env = {}
    if(env){
      for (const _k of Object.keys(env)) {
        global.env[_k] = env[_k]
      }
    }
    
    Object.freeze(global.env)

    try{
      await this.dataBase.authenticate()
      await this.dataBase.sync(global.env.database?.sync?.force? {force: true} : {})
      console.log(chalk.blue('MYSQL connected'))
    } catch (error) {
      console.log('error', error)
    }

    if (global.env.mode === 'dev') {
      this.app.use(morgan('dev'))
    }
    
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(request_mw())
    
    this.app.get('/', (req, res) => {
        res.send('API is running')
    })

    this.routes.init()

    const PORT = process.env.PORT || 5001
    
    this.app.listen(PORT, console.log(chalk.blue(`Server running on port ${PORT}`)))
  }
}
export  { App }