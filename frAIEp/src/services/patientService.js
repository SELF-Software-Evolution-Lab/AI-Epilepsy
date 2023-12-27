
import { get } from '../util/http'


export const  findPatients = async(search) =>   await  get(`/patients`, { params: { search } })