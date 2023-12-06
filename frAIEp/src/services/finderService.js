import { post } from "../util/http"


export const  goTo = async(path) => await post(`/finder/go-to`, { path }) 

export const  treeCached = async( ) => await post(`/finder/tree`)