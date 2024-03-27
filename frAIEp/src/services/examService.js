import { post } from "../util/http"

export const  createExam = async(exam) =>  await post(`/exams/create`, { ...exam }) 

export const  listExamsByPatient = async(patient_id_map) => await post(`/exams/`, { ...patient_id_map }) 