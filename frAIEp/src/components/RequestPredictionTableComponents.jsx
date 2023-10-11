import ModalSelectFilePrediction from "./ModalselectFilePrediction/ModalSelectFilePrediction";
import moment from "moment";

const RequestPredictionTableComponents = ({mri,eeg,arn,patient,setArn,setMri,setEeg}) => {
  
  const headers = ['ID','Tipo', 'Archivo' ,'Fecha', 'Accionables']
  return (
    <div>
      <table className="styled-table-rp">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
            {
              mri ? 
                <tr>
                  <td className="file-rp">{mri?.id}</td>
                  <td>{mri?.type}</td>
                  <td>{mri?.file}</td>
                  <td>{moment.utc(mri?.created_at).format('hh:mm A - YY-MM-DD')}</td> 
                  <td><ModalSelectFilePrediction type="MRI" patient={patient} setExam={setMri}/></td>       
                </tr>

              :null
            }
            {
              eeg ? 
                <tr>
                  <td className="file-rp">{eeg?.id}</td>
                  <td>{eeg?.type}</td>
                  <td>{eeg?.file}</td>
                  <td>{moment.utc(eeg?.created_at).format('hh:mm A - YY-MM-DD')}</td> 
                  <td><ModalSelectFilePrediction type="EEG" patient={patient} setExam={setEeg}/></td>
                </tr>
              : null
            }
            {
              arn ? 

              <tr>
                <td className="file-rp">{arn?.id}</td>
                <td>{arn?.type}</td>
                <td>{arn?.file}</td>
                <td>{moment.utc(arn?.created_at).format('hh:mm A - YY-MM-DD')}</td> 
                <td><ModalSelectFilePrediction type="ARN" patient={patient} setExam={setArn}/></td>        
              </tr>

              : null
            }
            <tr>
              
            </tr>
          
        </tbody>
      </table>
    </div>
  );
};

export default RequestPredictionTableComponents;
