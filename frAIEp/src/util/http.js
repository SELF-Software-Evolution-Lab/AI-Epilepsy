import { headers, validate } from "./authorization"
import axios from 'axios'
import { config } from '../config/env'


export const get = async(_path, _params = {}, _options = {}) =>{
  try{
    let options = {
      headers: {},
      ..._params
    }

    if(Object.keys(_options).length){
      Object.assign(options, _options)
    }

    options.headers['authorization'] = headers()

    const response = await axios.get(`${config.bkAPEp}${_path}`,options)
    return response.data
  } catch (error) {
    const response = error.toJSON()
    validate(response)
    return response
  }
}

export const post = async(_path, _params = {}, _options = {})=>{
  try{
    let options = {
      headers: {}
    }
    if(Object.keys(_options).length){
      Object.assign(options, _options)
    }
    
    options.headers['authorization'] = headers()

    const response = await axios.post(`${config.bkAPEp}${_path}`,_params, options)
    return response.data
  } catch (error) {
    const response = error.toJSON()
    validate(response)
    return response
  }
}