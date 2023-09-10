import axios from 'axios'
import { config } from '../config/env'


export const  findPatients = async(search) => {
  const response = await axios.get(`${config.bkAPEp}/patients`, {
    params: {
      search
    }
  })

  return response?.data
}