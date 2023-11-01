import axios from 'axios'
import { config } from '../config/env'


export const  createExam = async(exam) => {
  try{
    const response = await axios.post(`${config.bkAPEp}/exams/create`, {
      ...exam
    })
    return response?.data
    
  } catch (error) {
    console.log('error', error)
  }
}
export const  listExamsByPatient = async(patient_id) => {
  const response = await axios.get(`${config.bkAPEp}/exams/`, {
    patient_id
  })
  return response?.data
}