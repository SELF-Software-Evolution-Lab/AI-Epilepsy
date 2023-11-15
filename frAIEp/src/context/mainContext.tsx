import React, { useEffect, useState } from "react";
import { BaseContext } from "./baseContext";

export interface MainContextProps {
  children: React.ReactNode
}

export interface MainContextState {
  auth?:{
    token:string
  },
  user?:{
    id:string,
    first_name: string,
    can: any[]
  }
}

export interface IMainContext {
  setState: (_params: unknown)  => void
  getState: ()  => MainContextState
}


export default function MainContext(props:MainContextProps) {
  const [state, setState] = useState<MainContextState>({})

  const set = (_params)=>{
    const aux = Object.assign(state, _params)
    localStorage.setItem("SESSION", JSON.stringify(aux))
    setState(aux)
  }

  const getState = ()=>{
    return state
  }

  useEffect(()=>{
    const data = localStorage.getItem("SESSION")
    if(data){
      let aux = JSON.parse(data)
      setState(aux)
    }
  },[])

  const userCan = (module, access) =>{
    if(state?.auth?.token && state?.user?.can){
      return state?.user?.can?.[module]?.[access]
    }
    return false
  }

  const logged = () => {
    return !!state?.auth?.token
  }

  const logout = () => {
    setState({})
  }


  return (
    <BaseContext.Provider
      value={
        {
          setState: set,
          getState: getState,
          userCan: userCan,
          logged: logged,
          logout: logout
        }
      }
    >
      {props.children}
    </BaseContext.Provider>
  )
}
