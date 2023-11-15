import { useState, useContext, useEffect } from "react";
import MasterLayout from "./../layouts/MasterLayout";
import Swal from "sweetalert2";
import { login } from "../services/authService";
import { BaseContext } from "../context/baseContext";
import { useNavigate } from "react-router-dom";


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: false,
  width: '350px'
})

export default function Auth() {
  const context = useContext(BaseContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigate()

  useEffect(()=>{
    if(context.getState().auth?.token){
      navigation('/v2')
    }
  }, [])

  const handleLogin = async () =>{
    if(!username || username === '' || !password || password === ''){
      Toast.fire({
        icon: 'warning',
        title: 'Ingresa valores'
      })
      return
    }

    const response = await login(username, password)

    if(response.code !== 200){
      Toast.fire({
        icon: 'error',
        title: 'Valida tus credenciales'
      })
    } else {
      context.setState({
        user: response.user,
        auth: {
          token: response.token
        }
      })
      navigation('/v2')
    }
  }
  
  return (
    <>
      <MasterLayout>
        <div className="row justify-content-center">
          <div className="col-sm-4 p-2 text-center">
            <br/>
            <img src="/banner.png" className="w-100 my-4"></img>
            <br/><br/><br/>
            <input placeholder="Usuario" autoFocus type="text" onChange={(e)=> {setUsername(e.target.value)}} className="form-control mb-2"/>
            <input placeholder="Contraseña" type="password" onChange={(e)=> {setPassword(e.target.value)}} className="form-control mb-4"/>
            <button className="btn btn-lg btn-outline-light" onClick={handleLogin}>Acceder</button>
          </div>
        </div>
      </MasterLayout>
    </>
  )
}