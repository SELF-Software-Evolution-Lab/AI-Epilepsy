// Import required libraries and modules
import ora from 'ora' // Library for displaying loading spinners
import chalk from 'chalk' // Library for styling console output
import fs from 'node:fs' // Node.js filesystem module
import { config } from "@config/env" // Configuration settings
import { SeederModel } from '@client/models/seederModel' // Sequelize model for seeders
import db from '@app/database/connection' // Sequelize database connection
const args = require('minimist')(process.argv.slice(2)) // Command line arguments parser

export interface IConsole extends ora.Ora  {
  log?: (...args: any[]) => void,
  paint?: chalk.Chalk,
}
// Define a global environment object if not already defined
if(!global.env) global.env = {}
// Copy configuration settings to the global environment object
if(config){
  for (const _k of Object.keys(config)) {
    global.env[_k] = config[_k]
  }
}
// Define the main function for the CLI
const client = async() => {
  const _console = console.log
  
  // Function to decode names (convert hyphen-separated to camelCase)
  const decodeName = (name) => {
    const name_array = name.split('-')
    const name_array_camelize = name_array.map((n, i) => {
      if (i !== 0){
        return n.charAt(0).toUpperCase() + n.slice(1)
      } else {
        return n
      }
    })
    return name_array_camelize.join('')
  }
  
  // Function to run seeders
  const runSeeders = async (console) => {
    console.stopAndPersist({
      symbol: '🚀',
      text: `${console.paint.blue('Launching Seeders')}`,
    })
    console.log('')
    console.start()
    
    // Define the relative path to seeders
    const relative = '/src/seeders/'
    const path = `${process.cwd()}${relative}`
    
    // Read files in the seeders directory
    const files = fs.readdirSync(path, {encoding: "utf-8"})
    
    // Iterate through seeders and run them
    if (files && files.length > 0) {
      for (const seederName of files.filter(_f=> _f.includes('.ts'))) {
        const name = seederName.replace('.ts', '')
        try{
          
          // Check if the seeder has been launched before
          const exists = await SeederModel.findOne({
            where: {
              seeder: name
            }
          })
          if(exists){
            console.info(`Seeder ${console.paint.blue(name)} already launched`)
            continue
          } else {
            // Load and run the seeder
            const seeder = require(`${path}${seederName}`)
            const response = await seeder.run(args, console)
            // Update the database with the seeder's name
            if(response){
              await SeederModel.create({seeder: name})
              console.succeed(`Seeder ${console.paint.green(name)} launched`)
            } else {
              console.fail(`Seeder ${console.paint.red(name)} failed`)
            }
          }
        } catch (error) {
          console.warn(`Seeder ${console.paint.yellow(name)} aborted`)
        }
        console.stop()
      }
    }
    
  }
  
  {
    // Create an ora spinner instance for the CLI
    const console:IConsole = ora({
      text: 'aie-cli',
    })
    
    // Add custom properties to the console instance
    console.log = _console
    console.paint = chalk
    
    // Display a welcome message
    console.stopAndPersist({
      symbol: '🤖',
      text: 'Welcome to aie-cli',
    })
    console.log('')
    
    // Check if a task or seeder is specified in the command line arguments
    if(!args.seeder  && !args.task && !args.factory){
      console.fail('Error: No task specified')
      console.stop()
      process.exit(0)
    }
    
    // Execute the specified task or seeder
    if(args.task){
      // Run a task
      const relative = '/src/tasks/'
      const path = `${process.cwd()}${relative}`
      const name = decodeName(args.task)
      const task = require(`${path}${name}Program`)
      task.run(args, console)
    } else if(args.factory && args.n){
      const path = args.path
      const _name = args.n.split('-')
      let name = ''
      _name.forEach((_n, _i)=>{
        if(_i === 0){
          name += _n
        } else {
          name += `${_n.charAt(0).toUpperCase() }${_n.slice(1)}`
        }
      })
      const Name = `${name.charAt(0).toUpperCase() }${name.slice(1)}`
      
      if(args.d){
        args.c = true
        args.r = true
        args.s = true
      }

      if(args.m){
        const relative = '/src/app/models'
        const path = `${process.cwd()}${relative}`
        const template_file =  `${process.cwd()}/src/client/templates/modelTemplate.txt`
        
        let file = await fs.readFileSync(template_file, {encoding: 'utf-8'})
        
        file = file.replaceAll('<Model>', `${Name}`)
        file = file.replaceAll('<model>', name)
        
        await fs.writeFileSync(`${path}/${name}Model.ts`, file )
        
        let index = await fs.readFileSync(`${path}/index.ts`, {encoding: 'utf-8'})
        index = index.replace('@import_models', `@import_models\nimport { ${Name}Model } from '@app/models/${name}Model'`)
        index = index.replace('export {', `export {\n  ${Name}Model as ${Name},`)
        
        await fs.writeFileSync(`${path}/index.ts`, index )
      }
      
      if(args.seeder){
        const relative = '/src/seeders'
        const path = `${process.cwd()}${relative}`
        const template_file =  `${process.cwd()}/src/client/templates/seederTemplate.txt`
        
        let file = await fs.readFileSync(template_file, {encoding: 'utf-8'})
        
        await fs.writeFileSync(`${path}/${name}Seeder.ts`, file )
      }
      
      if(args.s){
        const relative = `/src/app/services/${name}`
        const path = `${process.cwd()}${relative}`
        const template_file =  `${process.cwd()}/src/client/templates/serviceTemplate.txt`
        
        let file = await fs.readFileSync(template_file, {encoding: 'utf-8'})
        file = file.replaceAll('<Service>', `${Name}`)
        file = file.replaceAll('<service>', name)

        if(args.m){
          file = file.replaceAll('import {  } from "@app/models"', `import { ${Name} } from "@app/models"`)
        }

        if(await !fs.existsSync(`${path}`)) await fs.mkdirSync(`${path}`)
        await fs.writeFileSync(`${path}/${name}Service.ts`, file )
      }

      if(args.c){
        const relative = `/src/app/controllers/${name}`
        const path = `${process.cwd()}${relative}`
        const template_file =  `${process.cwd()}/src/client/templates/controllerTemplate.txt`
        
        let file = await fs.readFileSync(template_file, {encoding: 'utf-8'})
        file = file.replaceAll('<Controller>', `${Name}`)
        file = file.replaceAll('<controller>', name)

        if(args.s){
          file = file.replaceAll('@import_services', `@import_services\nimport { ${Name}Service } from '@app/services/${name}/${name}Service'`)
          file = file.replaceAll('constructor () {}', `private service = new ${Name}Service()\n\n  constructor () {}`)
          file = file.replaceAll('constructor () {}', `constructor () {}\n\n  public test = async(req: Request, res: Response) => {\n    const _params = req._data()\n    const response = await this.service.test(_params)\n    return responseUtility.build(res, response)\n  }`)
        }

        

        if(await !fs.existsSync(`${path}`)) await fs.mkdirSync(`${path}`)
        await fs.writeFileSync(`${path}/${name}Controller.ts`, file )
      }

      if(args.r){
        const relative = '/src/app/routes'
        const path = `${process.cwd()}${relative}`
        const template_file =  `${process.cwd()}/src/client/templates/routeTemplate.txt`

        let file = await fs.readFileSync(template_file, {encoding: 'utf-8'})
        file = file.replaceAll('<Route>', `${Name}`)
        file = file.replaceAll('<route>', name)

        if(args.c){
          file = file.replaceAll('@import_controllers', `@import_controllers\nimport { ${Name}Controller } from "@app/controllers/${name}/${name}Controller"`)
          file = file.replaceAll('@declare_controller', `@declare_controller\n  private controller: ${Name}Controller = new ${Name}Controller()`)
          file = file.replaceAll('@routes', `@routes\n    { method: 'post', path: '/test', handler: this.controller.test , middleware: [] },`)
        }



        
        await fs.writeFileSync(`${path}/${name}Route.ts`, file )


        let index = await fs.readFileSync(`${process.cwd()}/src/app/routes/index.ts`, {encoding: 'utf-8'})
        index = index.replace('@import_routes', `@import_routes\nimport { ${Name}Route } from '@app/routes/${name}Route'`)
        index = index.replace('@declare_routes', `@declare_routes\n  private ${name}Route: ${Name}Route`)
        index = index.replace('@assign_routes', `@assign_routes\n    this.${name}Route = new ${Name}Route(this.app, this.prefix)`)
        index = index.replace('@init_routes', `@init_routes\n      this.${name}Route.init()`)

        
        await fs.writeFileSync(`${process.cwd()}/src/app/routes/index.ts`, index )

      }
      
      console.stop()
      process.exit()
      
    } else {
      // Run a seeder or a batch of seeders
      const relative = '/src/seeders/'
      const path = `${process.cwd()}${relative}`
      // Run a specific seeder
      if(typeof args.seeder === 'string'){
        const name = args.seeder
        const _name = args.seeder.replace('Seeder', '')
        const exists = await SeederModel.findOne({
          where: {
            seeder: name
          }
        })
        if(exists && !args.f){
          console.info(`Seeder ${console.paint.blue(_name)} already launched`)
          console.stop()
          process.exit()
        } else {
          console.info(`Launching seeder ${console.paint.blue(_name)}`)
          console.text = `${console.paint.blue(_name)}`
          try{
            const seeder = require(`${path}${name}`)
            console.start()
            const response = await seeder.run(args, console)
            console.stop()
            if(response){
              if(!args.f && !exists){
                await SeederModel.create({seeder: name})
              }
              console.succeed(`Seeder ${console.paint.green(_name)} launched`)
            } else {
              console.fail(`Seeder ${console.paint.red(_name)} failed`)
            }
          } catch (error) {
            console.log('error', error)
            console.warn(`Seeder ${console.paint.yellow(_name)} aborted`)
          }
        }
        process.exit(0)
      } else if(args.x) {
        // Run all seeders
        await runSeeders(console)
        process.exit(0)
      } else if(args.d) {
        // Run a development seeder
        const relative = '/src/seeders/dev/'
        const path = `${process.cwd()}${relative}`
        const name = 'initSeeder'
        const _name = name.replace('Seeder', '')
        const exists = await SeederModel.findOne({
          where: {
            seeder: name
          }
        })
        if(exists && !args.f){
          console.info(`Seeder ${console.paint.blue(_name)} already launched`)
          console.stop()
          process.exit()
        } else {
          console.info(`Launching seeder ${console.paint.blue(_name)}`)
          console.text = `${console.paint.blue(_name)}`
          try{
            const seeder = require(`${path}${name}`)
            console.start()
            const response = await seeder.run(args, console)
            console.stop()
            if(response){
              if(!args.f && !exists){
                await SeederModel.create({seeder: name})
              }
              console.succeed(`Seeder ${console.paint.green(_name)} launched`)
            } else {
              console.fail(`Seeder ${console.paint.red(_name)} failed`)
            }
          } catch (error) {
            console.log('error', error)
            console.warn(`Seeder ${console.paint.yellow(_name)} aborted`)
          }
        }
        process.exit(0)
      }
      
    }
  }
}
// Authenticate and sync the Sequelize database before running the client
db.authenticate().then(async () => {
  db.sync().then(async () => {
    await client()
  })
})





