import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ExamsTableComponent from "./../components/ExamTableComponent";
import { config } from "../config/env";

const ExamHistory = () => {
  const location = useLocation();
  const patient = location.state.patient;
  const exam = location.state.exam;
  const [exams, setExams] = useState([]);

  
  useEffect(() => {
    axios
      .get(`${config.bkAPEp}/exams`, {params: { patient_id: patient.id, type: exam.toLowerCase()}})
      .then((res) => {
        setExams(res.data.exams);
      });
  }, []);

  return (
    <div>
      <h1 className="titulo-principal">
        Historial de examenes {exam} para el paciente {patient.first_name}{" "}
        {patient.last_name}
      </h1>
      {exams.length > 0 ? (
        <ExamsTableComponent rows={exams}/>
      ) : (
        <p>
          No se encontraron exámenes MRI para el paciente {patient.first_name}{" "}
          {patient.last_name}
        </p>
      )}
       
    </div>
  );
};

export default ExamHistory;
