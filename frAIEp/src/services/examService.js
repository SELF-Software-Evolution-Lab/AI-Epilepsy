import { post, get } from "../util/http"

export const  createExam = async(exam) =>  await post(`/exams/create`, { ...exam }) 

export const  listExamsByPatient = async(patient_id) => await get(`/exams/`, { patient_id }) 