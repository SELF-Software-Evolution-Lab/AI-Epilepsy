import { Response } from 'express';
import { errors } from '@app/resources/errors/errors'
import { langUtility } from '@core/langUtility';


class ResponseUtility {
  
  
  constructor() {}
  
  public build (res: Response, object: any = {}){
    try{
      const code =  object['code'] || 500;
      return res.status(code).send(object);
    } catch (error) {
      console.log('error', error)
    }
  }

  public success(object: any = {}, code?: number){
    try{   
      const response = {
        code: 200,
        status: 'success',
        ...object
      }
      return response

    } catch (error) {
      console.log('error', error)
    }
  }

  public error(key?:string, variables?:any | null, object?: any | null){
    try{
      const response:any = { code: 500, status: 'error' }
      if(key){
        let error = errors

        for (const _k of key.split('.')) {
          if(error[_k]){
            error = error[_k]
          } else {
            break
          }
        }

        if(typeof error === 'object'){
          response.code = error['code'] || 500
          response.message = langUtility._(key, variables)
        } 
        response.system_message = key

        if(object){
          Object.assign(response, object)
        }

        return response
      } 
      
    } catch (error) {
      console.log('error', error)
    }
  }
}

export const responseUtility = new ResponseUtility()
export { ResponseUtility }