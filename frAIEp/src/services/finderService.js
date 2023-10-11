import axios from 'axios'
import { config } from '../config/env'


export const  goTo = async(path) => {

  const response = await axios.post(`${config.bkAPEp}/finder/go-to`, {
    path
  })

  return response?.data
}