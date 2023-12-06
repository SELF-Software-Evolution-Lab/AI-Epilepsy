import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import { findPatients } from "../services/patientService";
import MasterLayout from "../layouts/MasterLayout";
import { Button } from "react-bootstrap";
import { TbUserSearch } from "react-icons/tb";


export default function PatientsV2  ()  {
  const location = useLocation();
  const searchInput = location.state;
  const navigation = useNavigate()

  
  const [search, setSearch] = useState(searchInput)

  async function  handleSubmit ()  {
    if(search==='') return 
    const response = await findPatients(search)
    
    if(response.code === 200){
      if(response.patients && Array.isArray(response.patients)){
        setPatients(response.patients)
      }
    }
  }

  function handleKey(e) {
    if(e.key === 'Enter'){
      handleSubmit()
    }
  }

  const [patients, setPatients] = useState([]);
  
  
  useEffect(() => {
    if(searchInput === '') navigation('/')
    init()
  }, []);
  
  const init = async() => {
    
    const response = await findPatients(searchInput)
    
    if(response.code === 200){
      if(response.patients && Array.isArray(response.patients)){
        setPatients(response.patients)
      }
    }
  }

  const handleAction = (action, patient) =>{
    if(action === 'detail'){
      navigation(`/patient-v2`, {state:patient})
    }
  }
  
  return (
    <>
      <MasterLayout>
        <div className="row justify-content-center">
          <div className="col-8">
            <input onKeyDown={handleKey} value={search} type="text" onChange={(e)=> setSearch(e.target.value)} placeholder="Buscar pacientes" className="form-control text-white bg-dark shadow" />
          </div>
          <div className="col-1">
            <Button onClick={handleSubmit} variant="outline-info"><TbUserSearch /></Button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <div className="table-responsive">
              <table className="table table-dark table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Documento</th>
                    <th scope="col">Nombres</th>
                    <th scope="col">Genero</th>
                    <th scope="col">Email</th>
                    <th className="text-center" scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    patients.length && search ? 
                      patients.map(_p=>{
                        return(
                          <tr key={_p.id}>
                            <th scope="row">{_p.id}</th>
                            <td>{_p.document_id}</td>
                            <td>{_p.first_name} {_p.last_name}</td>
                            <td>{_p.gender === 'male' ? 'Masculino': 'Feminino'}</td>
                            <td>{_p.email}</td>
                            <td className="text-center">
                              <Button onClick={()=> handleAction('detail', _p)} size="sm" variant="outline-info">Ver</Button>
                            </td>
                          </tr>
                        )
                      })
                    : 
                      <tr>
                        <th colSpan={6} className="text-center" scope="row">No se encontraron resultados para {search}</th>
                      </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </MasterLayout>
      
    </>
  )
}