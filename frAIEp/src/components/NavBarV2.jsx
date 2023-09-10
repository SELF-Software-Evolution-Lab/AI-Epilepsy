import { Button } from "react-bootstrap";
import "./NavBarV2.css"
export default function NavBarV2() {
  return (
    <>

    
      <div className="bg-mate navbar d-fixed w-100 text-white p-2 shadow">
        <div className="container w-100">
          <div className="row align-items-center w-100">
            <div className="col">
              <img src="/banner.png" style={{height:"45px"}} />
            </div>
            <div className="col text-center">
              <a href="#" className="btn btn-link text-info text-decoration-none mx-2 fs-5">Inicio</a>
              <a href="#" className="btn btn-link text-info text-decoration-none mx-2 fs-5">Nosotros</a>
            </div>
            <div className="col text-end">
              <Button variant="outline-info">
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}