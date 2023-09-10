import React from 'react';
import RequestPredictionComponent from '../Components/RequestPredictionComponent';
import { useLocation } from "react-router-dom";


const RequestPrediction = () => {
    const location = useLocation();
    const patient = location.state;
    return (
        <div className='request-prediction-page'>
            <h1 className="titulo-principal">Solicitar predicción para el paciente {patient.first_name} {patient.last_name}</h1>
            <RequestPredictionComponent patient={patient}/>
           
        </div>
    );
}

export default RequestPrediction;
