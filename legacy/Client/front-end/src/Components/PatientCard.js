import React from "react";
import { useNavigate } from "react-router-dom";

const PatientCard = ({ patient, context }) => {
  const navigation = useNavigate();

  function handleClick() {
    console.log("clickeado papi");
    navigation(`/patients/${patient.document_id}`, { state: patient });
  }

  return (
    <section className="patient-card">
      <section className="patient-picture">
        <img className="patient-img" src="/icons/patientAvatar.png"></img>
      </section>
      <section className="patient-info">
        <ul className="patient-ul">
          <li>
            Nombre: {patient.first_name} {patient.last_name}
          </li>
          <li>Genero: {patient.gender}</li>
          <li>Documento: {patient.document_id}</li>
          <li>Grupo Sanguineo: A+</li>
          <li>Email: {patient.email}</li>
        </ul>
      </section>

      {context === "listPatients" ? (
        <button className="patientDetail-button" onClick={handleClick}>
          Ver Detalle
        </button>
      ) : null}
    </section>
  );
};

export default PatientCard;
