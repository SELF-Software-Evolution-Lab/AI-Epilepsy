import { Client } from 'basic-ftp';
import { v4 as unique } from 'uuid';
import moment from 'moment';

import { config } from '@config/env';

import { responseUtility } from '@core/responseUtility';

class FtpUtility {
  private static instance: FtpUtility;
  private connections: Client[]
  private cache: any[]
  constructor(){
    this.connections = []
    setInterval(async()=>{
      try{
        const connection =  unique()
        await this.connect(connection)
        this.cache = await this.getTree(connection)
      } catch (error) {
        console.log('error', error)
      }
    }, 20000)
  }

  public connect = async (key) => {
    try{
      const _config = config.ftp
      const connection = _config.connections[0]

      this.connections[key] = new Client(0) as Client
      this.connections[key].ftp.verbose = false
      await this.connections[key].access(connection)

      return responseUtility.success()
    } catch (error) {
      console.log('error', error)
    }
  }

  public disconnect = async (connection) => {
    try{
      this.connections[connection]?.close()
      this.connections[connection] = undefined
    } catch (error) {
      console.log('error', error)
    }
  }

  public  async ls (connection: string) {
    try{
      const response = await this.connections[connection].list()
      const pwd = await this.connections[connection].pwd()
      const files = []
      const folders = []
      if(Array.isArray(response)){
        for (const file of response) {
          try{
            if(file.type  === 1){
              files.push({
                name: file.name,
                path: `${pwd}/${file.name}`,
                type: file.type  === 1? 'file': 'directory',
                size: file.size,
                date: file.rawModifiedAt && moment.utc(file.rawModifiedAt).toISOString()
              })
            } else {
              folders.push({
                name: file.name,
                path: `${pwd}/${file.name}`,
                type: file.type  === 1? 'file': 'directory',
                size: file.size,
                date: file.rawModifiedAt && moment.utc(file.rawModifiedAt).toISOString()
              })
            }
            
          } catch (error) {
            console.log('error', error)
          }
        }
      }
      return responseUtility.success({files:[...folders, ...files]})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('ftpUtility.ls.failed_action')
    }
  }

  public async mov ( connection:string, from:string, to:string, file:string){
    try{
      await this.connections[connection].ensureDir(to)
      const response = await this.connections[connection].rename(`${from}`, `${to}/${file}`)
      return responseUtility.success({ path: `${to}/${file}`, response})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('ftpUtility.mov.failed_action')
    }
  }


  public async cmd (connection:string, command:string) {
    try{
      const response = await this.connections[connection].send(command)
      return responseUtility.success({command, response})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('ftpUtility.cmd.failed_action')
    }
  }
  
  public  async cd (connection: string, dir:string) {
    try{
      const response = await this.connections[connection].cd(dir)
      return responseUtility.success({
        path: await this.connections[connection].pwd(),
        response
      })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('ftpUtility.cd.failed_action')
    }
  }

  public  async pwd ( connection: string ) {
    try{
      return responseUtility.success({
        path: await this.connections[connection].pwd()
      })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('ftpUtility.cd.failed_action')
    }
  }

  public async getTree ( connection: string ) {
    try{
      const pwd = await this.connections[connection].pwd()

      const tree = []

      const content = await this.connections[connection].list()
      const getContent = async (folder) => {
        if(!folder.files) folder.files = []
        const response = await this.connections[connection].cd(folder.path)
        const content = await this.connections[connection].list()
        if(Array.isArray(content)){
          for (const file of content) {
            if(file.type  === 1){
              folder.files.push({
                name: file.name,
                path: `${folder.path}/${file.name}`,
                type: file.type  === 1? 'file': 'directory',
                size: file.size,
                date: file.rawModifiedAt && moment.utc(file.rawModifiedAt).toISOString()
              })
            } else {
              const _folder = {
                name: file.name,
                path: `${folder.path}/${file.name}`,
                type: file.type  === 1? 'file': 'directory',
                size: file.size,
                date: file.rawModifiedAt && moment.utc(file.rawModifiedAt).toISOString(),
                files: []
              }
              await getContent(_folder)
              folder.files.push(_folder)
            }
          }
        }
      }

      if(Array.isArray(content)){
        for (const file of content) {
          if(file.type  === 1){
            tree.push({
              name: file.name,
              path: `${pwd}/${file.name}`,
              type: file.type  === 1? 'file': 'directory',
              size: file.size,
              date: file.rawModifiedAt && moment.utc(file.rawModifiedAt).toISOString()
            })
          } else {
            const _folder = {
              name: file.name,
              path: `${pwd}/${file.name}`,
              type: file.type  === 1? 'file': 'directory',
              size: file.size,
              date: file.rawModifiedAt && moment.utc(file.rawModifiedAt).toISOString(),
              files: []
            }
            await getContent(_folder)
            tree.push(_folder)
          }
        }
      }
      
      this.disconnect(connection)

      return responseUtility.success({
        tree
      })

    } catch (error) {
      console.log('error', error)
    }
  }

  public async getTreeCached ( connection: string ) {
    try{
      if(this.cache) return this.cache

      return await this.getTree(connection)
    } catch (error) {
      console.log('error', error)
    }
  }

  public static getInstance() {
    try{
      if (!FtpUtility.instance) {
        FtpUtility.instance = new FtpUtility();
      }
      return FtpUtility.instance;
    } catch (error) {
      console.log('error', error)
    }
  }
}

export const ftpUtility = FtpUtility.getInstance()
export { FtpUtility }
