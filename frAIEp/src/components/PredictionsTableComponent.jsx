import  {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../config/env";

const PredictionsTableComponent = ({rows,patient}) => {
    const headers = ['No.','ID Predicción', 'Fecha', 'Accionables']
    const [predictions, setpredictions] = useState([]);
    const navigation = useNavigate();

    useEffect(() => {
      axios
        .get(`${config.bkAPEp}/predictions`, { params:{patient_id: patient.id}})
        .then((res) => {
          console.log('-------zadiaz:res', res)
          setpredictions(res.data.predictions);
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
      <table className="styled-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} >{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction,i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{prediction.id}</td>
              <td>{prediction.created_at}</td>
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
