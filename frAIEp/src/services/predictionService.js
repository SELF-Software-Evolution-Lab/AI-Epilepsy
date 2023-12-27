
import { get, post } from '../util/http'

export const  listPredictionByPatient = async(patient_id) => await get(`/predictions/`, { patient_id }) 

export const  createPrediction = async(exam) => await post(`/predictions/create`, { ...exam })