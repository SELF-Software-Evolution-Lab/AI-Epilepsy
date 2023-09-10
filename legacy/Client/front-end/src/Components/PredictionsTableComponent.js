import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {BACKEND_URL} from "../constants";

const PredictionsTableComponent = ({rows,patient}) => {
    const headers = ['No.','ID Predicción', 'Fecha', 'Accionables']
    const [predictions, setpredictions] = useState([]);
    const navigation = useNavigate();

    useEffect(() => {
      axios
        .get(`${BACKEND_URL}/predictions/${patient.document_id}`)
        .then((res) => {
          setpredictions(res.data);
        });
    }, []);

    const handlePredictionRequest = (prediction_id) => {
      const state = {
        id: prediction_id,
        patient: patient,
      }
      navigation("/prediction-detail", { state: state });
    };
    return (
        <div>
            <div>
      <table class="styled-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction,i) => (
            <tr>
              <td>{i+1}</td>
              <td>{prediction.prediction_id}</td>
              <td>{prediction.date_requested}</td>
              <td>
              <button className='event-detail-button' onClick={() =>handlePredictionRequest(prediction.prediction_id)}>Ver detalle</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
            
        </div>
    );
}

export default PredictionsTableComponent;
