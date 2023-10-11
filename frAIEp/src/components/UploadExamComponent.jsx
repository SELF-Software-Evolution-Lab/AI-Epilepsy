import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalSelectFile from './ModalAssociateFile/ModalSelectFile';
import axios from "axios";
import { createExam } from "../services/examService";

const UploadExamComponent = ({ patient, exam }) => {
  const navigation = useNavigate();
  const [selected, setSelected] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [observations, setObservations] = useState("");




  const handleObservationsChange = (e) => {
    setObservations(e.target.value);
    console.log(observations);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await createExam({
      patient_id: patient.id,
      detail: observations,
      file: selectedName,
      source: selected,
      type: exam
    })
    /* const formData = new FormData();
    formData.append("file", file);
    
    console.log(formData); */
    setTimeout(() => {
      /* axios
        .post("${BACKEND_URL}/upload-exam", formData)
        .then((response) => {
          console.log("File upload  succesfully");
          setUploadingState("Success");
        })
        .catch((err) => {
          setUploadingState("Error");
          console.log("Error uploading file", err);
        }); */
    }, 5000);
  };
  const handleCancel = () => {
    navigation(`/patients/${patient.id}`, { state: patient });
  };

  return (
    <div>
      <section className="upload-exam-container">
        { (
          <section>
            {
              selected ==='' ? 
                <h3 className="titulo-terciario">
                  Seleccione el archivo que desea asociar al paciente {patient.first_name} {patient.last_name}
                </h3>
              : null
            }
            <ModalSelectFile selected={selected} setSelected={setSelected} selectedName={selectedName} setSelectedName={setSelectedName} />
            <div className="px-4 py-3">
              {
                selected !== '' && `${selectedName} - ${selected}` 
              }

            </div>
            <h3 className="titulo-terciario">Observaciones</h3>
            <textarea
              className="observations-input"
              type="text"
              name="observations"
              onChange={handleObservationsChange}
            ></textarea>

            <section className="upload-exam-buttons">
              <button
                onClick={handleCancel}
                className="request-prediction-button"
              >
                Cancelar
              </button>
              <button onClick={handleSubmit} className="upload-exam-button">
                Asociar Exámen
              </button>
            </section>
          </section>
        )}
      </section>
    </div>
  );
};

export default UploadExamComponent;
