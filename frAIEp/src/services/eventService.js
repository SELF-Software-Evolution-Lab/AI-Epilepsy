import axios from 'axios'
import { config } from '../config/env'



export const  listEventsByPatient = async(patient_id) => {
  const response = await axios.get(`${config.bkAPEp}/events/`, {
    patient_id
  })
  return response?.data
}