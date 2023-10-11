import axios from 'axios'
import { config } from '../config/env'


export const  createExam = async(exam) => {
  const response = await axios.post(`${config.bkAPEp}/exams/create`, {
    ...exam
  })
  return response?.data
}