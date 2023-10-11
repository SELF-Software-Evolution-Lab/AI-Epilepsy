/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RequestPredictionTableComponents from "./RequestPredictionTableComponents";
import Spinner from "react-bootstrap/Spinner";
import { config } from "../config/env";

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
      .get(`${config.bkAPEp}/exams`, {params: { patient_id: patient.id, type: 'mri'}})
      .then((res) => {
        setMri(res.data.exams)
      });

    axios
      .get(`${config.bkAPEp}/exams`, {params: { patient_id: patient.id, type: 'eeg'}})
      .then((res) => {
        setEeg(res.data.exams);
      });

    axios
      .get(`${config.bkAPEp}/exams`, {params: { patient_id: patient.id, type: 'arn'}})
      .then((res) => {
        setArn(res.data.exams);
      });
  }, []);

  

  const hanldePredict = () => {
    setSendingState("Sending");
    let prediction_id = "";

    axios
      .post(`${config.bkAPEp}/predictions/create`,{
        mri: mri[0],
        arn: arn[0],
        eeg: eeg[0],
        patient_id: patient.id
      })
      .then((res) => {
        handleCancel()
      });
  };

  const putInQueue = (data) => {
    axios
      .post(
        `${config.bkAPEp}/predict/${patient.document_id}?fname=${patient.first_name}&lname=${patient.last_name}`,
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
            
            {mri.length > 0 || arn.length > 0 || eeg.length > 0 ? (
              <RequestPredictionTableComponents
                mri={mri[0]}
                eeg={eeg[0]}
                arn={arn[0]}
                patient={patient}
                setArn={changeArn}
                setEeg={changeEeg}
                setMri={changeMri}
              />
              
            ):null}

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
            <img className= "success-icon "src={"/icons/checked.png"}></img>
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
