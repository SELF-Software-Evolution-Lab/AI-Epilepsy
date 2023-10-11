import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../config/env";


const PredictionDetail = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const id = location.state.id;
  const patient = location.state.patient;

  const [prediction, setPrediction] = useState({});

  useEffect(() => {
    axios.get(`${config.bkAPEp}/prediction/${id}`).then((res) => {
      setPrediction(res.data[0]);
    });
  }, []);

  const handleCancel = () => {
    navigation(`/patients/${patient.id}`,{ state:patient})
}
  console.log(prediction);

  return (
    <div>
      <h1 className="titulo-principal">Detalle de la predicción con id {id}</h1>
      {prediction ? (
        <section className="prediction-detail-container">
          <h3 className="titulo-terciario-center">INFORME PREDICTIVO</h3>
          <p className="prediction-field">
            <strong>Nombre: </strong>
            {patient.first_name} {patient.last_name}
          </p>
          <p className="prediction-field">
            <strong>Sexo: </strong>
            {patient.gender}
          </p>
          <p className="prediction-field">
            <strong>Edad: </strong>
            {patient.age}
          </p>
          <p className="prediction-field">
            <strong>Documento ID: </strong>
            {patient.document_id}
          </p>
          <p className="prediction-field">
            <strong>Fecha de la predicción: </strong>
            {prediction.created_at}
          </p>
          <p className="prediction-result">
            <strong>Predicción general: </strong>El modelo predictivo
            sugiere que, basado en los tres exámenes suministrados ( MRI, EEG y
            micro ARNs), el paciente {patient.first_name} {patient.last_name} es{" "}
            <strong>{prediction.label}</strong>
          </p>
          <p className="prediction-result">
            Team ai_epilepsy,
          </p>
          <img  className="prediction-icon"src={"/logo.png"}></img>
          <section className="prediction-detail-buttons">
            <button onClick={handleCancel} className="request-prediction-button">Listo</button>
            
        </section>
        </section>
      ) : (
        <section className="prediction-detail-container">
          <p>No se encontró del detalle de la predicción</p>
        </section>
      )}
    </div>
  );
};

export default PredictionDetail;
