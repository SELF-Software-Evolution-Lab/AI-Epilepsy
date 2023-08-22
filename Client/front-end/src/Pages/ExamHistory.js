import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ExamsTableComponent from "../Components/ExamTableComponent";
import {BACKEND_URL} from "../constants";

const ExamHistory = () => {
  const location = useLocation();
  const patient = location.state.patient;
  const exam = location.state.exam;
  const [exams, setExams] = useState([]);

  
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/exams/${patient.document_id}?type=${exam}`)
      .then((res) => {
        setExams(res.data);
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
