import { get } from 'http'

export const  listEventsByPatient = async(patient_id) => await get(`/events/`, { patient_id }) 