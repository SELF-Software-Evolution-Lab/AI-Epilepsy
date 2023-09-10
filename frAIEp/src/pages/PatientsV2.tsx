import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


import { findPatients } from "../services/patientService";


export default function Patients  ()  {
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
    <>
      
      
    </>
  )
}