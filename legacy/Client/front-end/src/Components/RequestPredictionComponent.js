import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RequestPredictionTableComponents from "./RequestPredictionTableComponents";
import Spinner from "react-bootstrap/Spinner";
import {BACKEND_URL} from "../constants";

const RequestPrediction = ({ patient }) => {
  const navigation = useNavigate();
  const [mri, setMri] = useState([]);
  const [eeg, setEeg] = useState([]);
  const [arn, setArn] = useState([]);
  const [sendingState, setSendingState] = useState("Not added");

  const changeMri = (exam) => {
    setMri(exam)
  }
  const changeEeg = (exam) => {
    setEeg(exam)
  }
  const changeArn = (exam) => {
    setArn(exam)
  }

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/recent-MRI/${patient.document_id}`)
      .then((res) => {
        setMri(res.data);
      });

    axios
      .get(`${BACKEND_URL}/recent-EEG/${patient.document_id}`)
      .then((res) => {
        setEeg(res.data);
      });

    axios
      .get(`${BACKEND_URL}/recent-ARN/${patient.document_id}`)
      .then((res) => {
        setArn(res.data);
      });
  }, []);

  

  const hanldePredict = () => {
    setSendingState("Sending");
    let prediction_id = "";

    axios
      .post(`${BACKEND_URL}/create-prediction/${patient.document_id}`)
      .then((res) => {
        console.log("Response:", res.data);
        prediction_id = res.data;
        const data = {
          patient_id: prediction_id,
          mri_path: mri[0].storage_path,
          eeg_path: eeg[0].storage_path,
          mirna_id: arn[0].storage_path,
        };
        putInQueue(data);
      });
  };

  const putInQueue = (data) => {
    console.log();
    console.log("patient", patient.first_name);
    console.log("patient", patient.last_name);
    axios
      .post(
        `${BACKEND_URL}/predict/${patient.document_id}?fname=${patient.first_name}&lname=${patient.last_name}`,
        data
      )
      .then((res) => {
        setSendingState("In queue");
      });
  };

  const handleCancel = () => {
    navigation(`/patients/${patient.id}`, { state: patient });
  };

  return (
    <div>
      <section className="request-prediction-container">
        {sendingState === "Not added" && (
          <div>
            <h3 className="titulo-terciario">Exámenes disponibles:</h3>
            {mri.length > 0 && arn.length > 0 && eeg.length > 0 && (
              <RequestPredictionTableComponents
                mri={mri[0]}
                eeg={eeg[0]}
                arn={arn[0]}
                patient={patient}
                setArn={changeArn}
                setEeg={changeEeg}
                setMri={changeMri}
              />
            )}

            <h4 className="titulo-cuaternario">
              Seguro que quieres solicitar una predicción a través de estos 3
              exámenes?
            </h4>
            <section className="request-prediction-buttons">
              <button
                onClick={handleCancel}
                className="request-prediction-button"
              >
                Cancelar
              </button>
              <button
                onClick={hanldePredict}
                className="request-prediction-button"
              >
                Solicitar
              </button>
            </section>
          </div>
        )}

        {sendingState === "Sending" && (
          <Spinner className="loading-spinner" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {sendingState === "In queue" && (
          <section>
            <div className="succes-message-container_p">
            <p className="titulo-terciario-center">
            La predicción fue solicitada correctamente, se le notificará
              cuando el modelo predictivo tenga una respuesa 
            </p>
            <img className= "success-icon "src={process.env.PUBLIC_URL + "/icons/checked.png"}></img>
            </div>
            <section className="request-prediction-buttons">
              <button
                onClick={handleCancel}
                className="request-prediction-button"
              >
                Listo
              </button>
            </section>
          </section>
        )}
      </section>
    </div>
  );
};

export default RequestPrediction;
