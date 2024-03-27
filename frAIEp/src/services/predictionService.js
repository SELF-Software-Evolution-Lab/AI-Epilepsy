
import { post } from '../util/http'

export const  listPredictionByPatient = async(patient_id_map) => await post(`/predictions/`, { ...patient_id_map }) 

export const  createPrediction = async(exam) => await post(`/predictions/create`, { ...exam })