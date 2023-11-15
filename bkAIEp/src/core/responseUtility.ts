import { Response } from 'express';
import { errors } from '@app/resources/errors/errors'
import { langUtility } from '@core/langUtility';

/**
* Utility class for handling responses in an Express application.
* @class ResponseUtility
*/
class ResponseUtility {
  
  /**
  * Creates an instance of ResponseUtility.
  * @memberof ResponseUtility
  */
  constructor() {}
  
  /**
  * Build and send a response to the client.
  * @param {Response} res - Express Response object.
  * @param {any} object - The response object.
  * @returns {Response} The Express Response object.
  * @memberof ResponseUtility
  */
  public build (res: Response, object: any = {}){
    try{
      // Extract the status code from the response object or default to 500.
      const code =  object['code'] || 500;
      // Set the HTTP status code and send the response.
      return res.status(code).send(object);
    } catch (error) {
      // Log any errors that occur during response building.
      console.log('error', error)
    }
  }
  
  /**
  * Build a success response object.
  * @param {any} object - Additional properties to include in the success response.
  * @param {number} code - The HTTP status code (default is 200).
  * @returns {any} The success response object.
  * @memberof ResponseUtility
  */
  public success(object: any = {}, code?: number){
    try{   
      // Build a success response object with default values and the object data.
      const response = {
        code: 200,
        status: 'success',
        ...object
      }
      return response
    } catch (error) {
      // Log any errors that occur during success response building.
      console.log('error', error)
    }
  }
  
  /**
  * Build an error response object based on a key, with optional variables and additional properties.
  * @param {string} key - The key to look up the error message.
  * @param {any | null} variables - Optional variables to interpolate into the error message.
  * @param {any | null} object - Additional properties to include in the error response.
  * @returns {any} The error response object.
  * @memberof ResponseUtility
  */
  public error(key?:string, variables?:any | null, object?: any | null){
    try{
      // Initialize the error response object with default values.
      const response:any = { code: 500, status: 'error' }
      if(key){
        let error = errors
        
        // Traverse the errors object based on the provided key.
        for (const _k of key.split('.')) {
          if(error[_k]){
            error = error[_k]
          } else {
            break
          }
        }
        
        // If the error is an object, extract code and message from it.
        if(typeof error === 'object'){
          response.code = error['code'] || 500
          response.message = langUtility._(key, variables)
        } 
        response.system_message = key
        
        // Merge additional properties into the error response.
        if(object){
          Object.assign(response, object)
        }

        return response
      } 
      
    } catch (error) {
      // Log any errors that occur during error response building.
      console.log('error', error)
    }
  }
}

// Singleton instance of ResponseUtility
export const responseUtility = new ResponseUtility()
export { ResponseUtility }