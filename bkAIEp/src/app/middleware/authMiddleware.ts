import { responseUtility } from '@core/responseUtility'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import {config} from "@config/env";


/**
* Middleware function that enhances the request object by adding a `_data` function.
* The `_data` function returns an object containing parameters from `req.params`, `req.query`, and `req.body`.
* @returns {Function} Middleware function to be used in Express routes.
*/
export const request = async (req:Request, res: Response, next: NextFunction) => {
  const headers = JSON.parse(JSON.stringify(req.headers))
  if(!headers['authorization'] || !headers['authorization'].includes('Bearer ')) {
    const error = responseUtility.error('unauthorize', null, { code: 401})
    return responseUtility.build(res, error)
  } else {
    let verify
    try{
      verify = jwt.verify( headers['authorization'].replace('Bearer ', '') , config.jwt)
    } catch (error) { }
    if(!verify?.user){
      const error = responseUtility.error('unauthorize', null, { code: 401})
      return responseUtility.build(res, error)
    } else {
      req['params'].user_logged = verify.user
    }
  }
  next()
}
