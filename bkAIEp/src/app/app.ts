// Import required modules and dependencies
import 'dotenv/config'
import express from "express"
import { Sequelize } from 'sequelize'
import cors from "cors"
import { config as env } from "@config/env"
import morgan from 'morgan'
import chalk from 'chalk'

// Import the 'Routes' class from the '@app/routes' module
import { Routes } from "@app/routes"

// Import the 'request' middleware from the '@app/middleware/requestMiddleware' module
import { request as request_mw } from "@app/middleware/requestMiddleware"

// Import the Sequelize database connection from the '@app/database/connection' module
import db from "@app/database/connection"


class App {

  /**
  * Express application instance.
  * @type {Application}
  * @private
  */
  private app: express.Application

  /**
  * Routes instance for handling application routes.
  * @type {Routes}
  * @private
  */
  private routes: Routes

  /**
  * Sequelize database instance.
  * @type {Sequelize}
  * @private
  */
  private dataBase: Sequelize

  constructor() {
    this.app = express()
    this.routes = new Routes(this.app)
    this.dataBase = db
  }

  /**
  * Initializes the application.
  * @returns {Promise<void>} A Promise that resolves when the initialization is complete.
  */
  public async init() {
    // Ensure global.env is initialized
    if(!global.env) global.env = {}
    // Copy environment variables to global.env
    if(env){
      for (const _k of Object.keys(env)) {
        global.env[_k] = env[_k]
      }
    }
    console.log(global.env)

    // Freeze the global.env object to prevent further modifications
    Object.freeze(global.env)

    try{
      // Delayed initialization using setTimeout to allow time for other processes
      setTimeout( async()=>{
        try{
          // Authenticate with the database
          await this.dataBase.authenticate()
          // Sync the database, optionally forcing synchronization if specified in the environment
          await this.dataBase.sync(global.env.database?.sync?.force? {force: true} : {})
          console.log(chalk.blue('MYSQL connected'))

        } catch (error) {
          // Handle database authentication and synchronization errors
          console.log('error', error)
        }
      }, global.env.mode === 'dev' ? 100 : 3000 )

    } catch (error) {
      // Handle general initialization errors
      console.log('error', error)
    }

    // Enable CORS middleware
    this.app.use(cors())
    this.app.options('*', cors()) // include before other routes

    // Enable morgan logging middleware in 'dev' mode
    if (global.env.mode === 'dev') {
      this.app.use(morgan('dev'))
    }

    // Enable middleware for parsing JSON requests
    this.app.use(express.json())


    // Enable custom request middleware
    this.app.use(request_mw())

    // Define a simple route to indicate that the API is running
    this.app.get('/', (req, res) => {
      res.send('API is running')
    })

    // Initialize application routes
    this.routes.init()

    // Set /temp/mri as the static directory for serving MRI files
    this.app.use('/temp/mri', express.static('temp/mri'))

    // Obtain the port number from the environment or use a default value (5001)
    const PORT = global.env.PORT || 8089

    // Start the server and log the port number
    this.app.listen(PORT, console.log(chalk.blue(`Server running on port ${PORT}`)))
  }
}
export  { App }