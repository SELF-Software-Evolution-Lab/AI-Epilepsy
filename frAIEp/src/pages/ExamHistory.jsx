import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import ExamsTableComponent from "./../components/ExamTableComponent";
import {config} from "../config/env";

const ExamHistory = () => {
  const location = useLocation();
  const patient = location.state.patient;
  const exam = location.state.exam;
  const [exams, setExams] = useState([]);
  const navigation = useNavigate()

  
  useEffect(() => {
    axios
      .get(`${config.bkAPEp}/exams`, {params: { patient_id: patient.id, type: exam.toLowerCase()}})
      .then((res) => {
        setExams(res.data.exams);
      });
  }, []);

  const handleClick = (examId) => {
    return (e) => {
      if (exam === "MRI") {
        navigation(`/patients/${patient.document_id}/exams/mri/${examId}`)
      }
    }
  }

  return (
    <div>
      <h1 className="titulo-principal">
        Historial de examenes {exam} para el paciente {patient.first_name}{" "}
        {patient.last_name}
      </h1>
      {exams.length > 0 ? (
        <ExamsTableComponent rows={exams} handleClick={handleClick}/>
      ) : (
        <p>
          No se encontraron exámenes {exam} para el paciente {patient.first_name}{" "}
          {patient.last_name}
        </p>
      )}
       
    </div>
  );
};

export default ExamHistory;
