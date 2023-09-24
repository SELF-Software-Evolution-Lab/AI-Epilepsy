

import { ftpUtility } from "@core/ftpUtility"
import { responseUtility } from "@core/responseUtility"

class FinderService {
  
  constructor () {}

  public async goTo (_params: { connection?:string ,path?: string }) {
    try{
      const connection = _params.connection || 'homi'
      if(_params.path){
        const cd = await ftpUtility.cd( connection, _params.path )
      }
      const ftp = await ftpUtility.ls( connection )
      const pwd = await ftpUtility.pwd( connection )
      return responseUtility.success({
        ftp,
        path: pwd.path
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async transfer (_params: { connection?:string , from:string, to:string, file:string }) {
    try{
      const connection = _params.connection || 'homi'

      if(!_params.from) return responseUtility.error('finder.transfer.not_from')
      if(!_params.to) return responseUtility.error('finder.transfer.not_to')

      const transfer = await ftpUtility.mov(connection, _params.from, _params.to, _params.file)
      return responseUtility.success({
        ...transfer
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  public async test (_params: any) {
    try{
      await ftpUtility.connect()
      const ftp = await ftpUtility.ls('homi')
      
      return responseUtility.success({
        ftp
      })
    } catch (error) {
      console.log('error', error)
    }
  }

}

export const finderService = new FinderService()
export { FinderService }