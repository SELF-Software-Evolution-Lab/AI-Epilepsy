import axios from 'axios'
import { config } from '../config/env'



export const  listPredictionByPatient = async(patient_id) => {
  const response = await axios.get(`${config.bkAPEp}/predictions/`, {
    patient_id
  })
  return response?.data
}

export const  createPrediction = async(exam) => {
  try{
    const response = await axios.post(`${config.bkAPEp}/predictions/create`, {
      ...exam
    })
    return response?.data
  } catch (error) {
    console.log('error', error)
  }
}