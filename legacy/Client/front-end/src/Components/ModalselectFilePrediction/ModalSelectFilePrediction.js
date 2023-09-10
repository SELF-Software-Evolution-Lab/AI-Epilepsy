import React, {useState, useEffect} from 'react';
import axios from "axios";
import ExamBucketTableComponent from '../ExamBucketTableComponent/ExamBucketTableComponent';
import {BACKEND_URL} from "../../constants";

const ModalSelectFilePrediction = ({type, patient,setExam}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [exams, setExams] = useState([]);

  
    useEffect(() => {
      axios
        .get(`${BACKEND_URL}/exams/${patient.document_id}?type=${type}`)
        .then((res) => {
          setExams(res.data);
        });
    }, []);

    const openModal = () => {
        setIsOpen(true);
       
      };

  const closeModal = () => {
    setIsOpen(false);
   
  };

  

  return (
    <div>
    <button className="select-exam-button_p" onClick={openModal} >Seleccionar otro examen</button>
      {isOpen && <div className="modal-page-container">
        <div className="modal-container">
          <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
            <h3 className="titulo-terciario-center_p">Otros {type}s disponibles del paciente</h3>
            <ExamBucketTableComponent rows={exams} closeModal={closeModal} setExam={setExam} />
          </div>
        </div>
      </div>}
  </div>
  );
}

export default ModalSelectFilePrediction;
