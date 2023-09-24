import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import PatientCard from "./../components/PatientCard";
import PatientNotFoundComponent from "./../components/PatientNotFoundComponent";

import { findPatients } from "../services/patientService";

const Patients = () => {
  const location = useLocation();
  const searchInput = location.state;
  
  const [patients, setPatients] = useState([]);
  
  
  useEffect(() => {
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
  
  
  
  
  return (
    <div>
      <h1 className="titulo-principal">Resultados de búsqueda para  {searchInput} </h1>
      {
        patients && patients.length ? 
          patients.map(_p=>( <PatientCard key={_p.id} patient={_p} context="listPatients" /> ))
        : <PatientNotFoundComponent/>
      }

      
    
    </div>
    );
  }
  
  export default Patients;
