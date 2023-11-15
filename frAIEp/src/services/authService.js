import axios from 'axios'
import { config } from '../config/env'


export const  login = async(username, password) => {
  try{
    const response = await axios.post(`${config.bkAPEp}/auth/login`, {
      username,
      password
    })
    return response?.data
    
  } catch (error) {
    return error.toJSON()
  }

}