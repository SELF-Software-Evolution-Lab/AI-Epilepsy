import ora from 'ora'
import chalk from 'chalk'
import fs from 'node:fs'
import { config } from "@config/env"
import { SeederModel } from '@client/models/seederModel'
import db from '@app/database/connection'
const args = require('minimist')(process.argv.slice(2))
export interface IConsole extends ora.Ora  {
  log?: (...args: any[]) => void,
  paint?: chalk.Chalk,
}
if(!global.env) global.env = {}
if(config){
  for (const _k of Object.keys(config)) {
    global.env[_k] = config[_k]
  }
}

const client = async() => {
  const _console = console.log
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
  
  const runSeeders = async (console) => {
    console.stopAndPersist({
      symbol: '🚀',
      text: `${console.paint.blue('Launching Seeders')}`,
    })
    console.log('')
    console.start()
    const relative = '/src/seeders/'
    const path = `${process.cwd()}${relative}`
    const files = fs.readdirSync(path, {encoding: "utf-8"})
    if (files && files.length > 0) {
      for (const seederName of files.filter(_f=> _f.includes('.ts'))) {
        const name = seederName.replace('.ts', '')
        try{
          const exists = await SeederModel.findOne({
            where: {
              seeder: name
            }
          })
          if(exists){
            console.info(`Seeder ${console.paint.blue(name)} already launched`)
            continue
          } else {
            const seeder = require(`${path}${seederName}`)
            const response = await seeder.run(args, console)
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
    
    const console:IConsole = ora({
      text: 'aie-cli',
    })
    
    
    console.log = _console
    console.paint = chalk
    
    
    console.stopAndPersist({
      symbol: '🤖',
      text: 'Welcome to aie-cli',
    })
    console.log('')
    
    
    if(!args.seeder  && !args.task){
      console.fail('Error: No task specified')
      console.stop()
      process.exit(0)
    }
    
    if(args.task){
      const relative = '/src/tasks/'
      const path = `${process.cwd()}${relative}`
      const name = decodeName(args.task)
      const task = require(`${path}${name}Program`)
      task.run(args, console)
    } else {
      const relative = '/src/seeders/'
      const path = `${process.cwd()}${relative}`
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
        await runSeeders(console)
        process.exit(0)
      }
    }
  }
}
db.authenticate().then(async () => {
  db.sync().then(async () => {
    await client()
  })
})





