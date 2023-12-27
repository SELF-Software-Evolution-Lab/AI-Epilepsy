//import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import "./NavBarV2.css"
import { useContext } from "react"
import { BaseContext } from "../context/baseContext";
export default function NavBarV2() {
  const context = useContext(BaseContext)
  const navigation = useNavigate()
  function handleClick(to) {
    navigation(`/${to}`)
  }

  const handleLogout = () =>{
    context.logout()
    handleClick('auth')
  }
  return (
    <>    
      <div className="bg-mate navbar d-fixed w-100 text-white p-2 shadow">
        <div className="container w-100">
          <div className="row align-items-center w-100">
            <div className="col">
              <img src="/banner.png" onClick={()=> handleClick('')} style={{height:"45px", cursor:'pointer'}} />
            </div>
            <div className="col text-center">
              {
                context.logged() ? 
                  <a href="#" onClick={()=> handleClick('')} className="btn btn-link text-info text-decoration-none mx-2 fs-5">Inicio</a>
                : null
              }
              <a href="#" onClick={()=> handleClick('about')} className="btn btn-link text-info text-decoration-none mx-2 fs-5">Nosotros</a>
              {
                context.logged() ? 
                <a href="#" onClick={()=> handleLogout()} className="btn btn-link text-info text-decoration-none mx-2 fs-5">Logout</a>
                : 
                  <a href="#" onClick={()=> handleClick('auth')} className="btn btn-link text-info text-decoration-none mx-2 fs-5">Login</a>
              }
            </div>
            <div className="col text-end">
              {/* <Button variant="outline-info">
                Iniciar Sesión
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}