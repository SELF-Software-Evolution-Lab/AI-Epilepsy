import { Request, Response, NextFunction } from 'express'


export const request= () => {
  return (req:Request, res: Response, next: NextFunction) => {
    req._data = () => ({...req.params, ...req.query, ...req.body})
    next()
  }
}