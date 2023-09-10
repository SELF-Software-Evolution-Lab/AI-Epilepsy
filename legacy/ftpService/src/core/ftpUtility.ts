import { Client } from 'basic-ftp'
import moment from 'moment';

import { config } from '@config/env';

import { responseUtility } from '@core/responseUtility';

class FtpUtility {
  private static instance: FtpUtility;
  private connections: Client[]
  constructor(){
    this.connections = []
  }

  public connect = async () => {
    try{
      const _config = config.ftp
      if(_config && Array.isArray(_config.connections)){
        for (const connection of _config.connections) {
          this.connections[connection.key] = new Client(0) as Client
          this.connections[connection.key].ftp.verbose = _config.logger
          await this.connections[connection.key].access(connection)
        }
      }
      return responseUtility.success()
    } catch (error) {
      console.log('error', error)
    }
  }

  public disconnect = async () => {
    try{
      for (const connection of this.connections) {
        await connection.close()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  public  async ls (connection: string) {
    try{
      const response = await this.connections[connection].list()
      const files = []
      if(Array.isArray(response)){
        for (const file of response) {
          files.push({
            file: file.name,
            type: file.type  === 1? 'file': 'directory',
            size: file.size,
            date: moment.utc(file.rawModifiedAt).toISOString()
          })
        }
      }
      return responseUtility.success({files})
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('ftpUtility.ls.failed_action')
    }
  }

  public async mov ( connection:string, from:string, to:string, file:string){
    try{
      const response = await this.connections[connection].rename(`${from}${file}`, `${to}${file}`)
      return responseUtility.success({ path: `${to}${file}`, response})
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

  public  async pwd (connection: string, dir:string) {
    try{
      return responseUtility.success({
        path: await this.connections[connection].pwd()
      })
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('ftpUtility.cd.failed_action')
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