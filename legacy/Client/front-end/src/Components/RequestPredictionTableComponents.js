import React from "react";
import ModalSelectFilePrediction from "./ModalselectFilePrediction/ModalSelectFilePrediction";

const RequestPredictionTableComponents = ({mri,eeg,arn,patient,setArn,setMri,setEeg}) => {
    const headers = ['Nombre del examen','Tipo', 'Formato' ,'Fecha', 'Accionables']
  return (
    <div>
      <table class="styled-table-rp">
        <thead>
          <tr>
            {headers.map((header) => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          
            <tr>
              <td className="file-rp">{mri.exam_id}</td>
              <td>MRI</td>
              <td>.zip</td>
              <td>{mri.date}</td> 
              <td><ModalSelectFilePrediction type="MRI" patient={patient} setExam={setMri}/></td>       
            </tr>
            <tr>
              <td className="file-rp">{eeg.exam_id}</td>
              <td>EEG</td>
              <td>.edf</td>
              <td>{eeg.date}</td>   
              <td><ModalSelectFilePrediction type="EEG" patient={patient} setExam={setEeg}/></td>
            </tr>
            <tr>
              <td className="file-rp">{arn.exam_id}</td>
              <td>Micro ARNs</td>
              <td>.txt</td>
              <td>{arn.date}</td>    
              <td><ModalSelectFilePrediction type="ARN" patient={patient} setExam={setArn}/></td>        
            </tr>
            <tr>
              
            </tr>
          
        </tbody>
      </table>
    </div>
  );
};

export default RequestPredictionTableComponents;
