import { post } from 'http'

export const  listEventsByPatient = async(patient_id_map) => await post(`/events/`, { ...patient_id_map }) 