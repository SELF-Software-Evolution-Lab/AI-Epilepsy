import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios'
import PatientCard from "../Components/PatientCard";
import PatientNotFoundComponent from "../Components/PatientNotFoundComponent";
import {BACKEND_URL} from "../constants";

const Patients = () => {
    const location = useLocation();
    const searchInput = location.state;

    const [patient, setPatient] = useState([]);
    const numbers = [1,2,3,4,5,6,7]
  
    useEffect(() => {
        axios.get(`${BACKEND_URL}/patients/${searchInput}`).then((res) =>{
        
            setPatient(res.data[0])
        
        })
    }, []);


    
    
    return (
        <div>
            <h1 className="titulo-principal">Resultados de búsqueda para  {searchInput} </h1>
            {patient ? <PatientCard patient={patient} context="listPatients" />
            : <PatientNotFoundComponent/>}
                  
            
        </div>
    );
}

export default Patients;
