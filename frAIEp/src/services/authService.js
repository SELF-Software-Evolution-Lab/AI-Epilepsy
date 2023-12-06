import { post } from "../util/http"

export const login = async(username, password) => await  post('/auth/login', {username,password})
