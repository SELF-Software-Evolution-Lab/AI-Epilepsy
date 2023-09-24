import React from "react";
import ExamHistory from "./../pages/ExamHistory";
import moment from "moment";

const ExamsTableComponent = ({rows }) => {
  const headers = ['No.','ID Examen', 'Fecha', 'Accionables']

  const handleDowload = () => {
    console.log("Se clickeo download")
  }

  return (
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
          {rows.map((row, i) => (
            <tr>
              <td>{i+1}</td>
              <td>{row.id}</td>
              
              <td>{moment.utc(row.created_at).format('hh:mm A - YY-MM-DD')}</td>
              <td>
              <button className='event-detail-button'>Ver detalle</button>
              {/* <img className="download-icon" alt="boton-descargar" src="/icons/download.png" onClick={handleDowload}></img> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamsTableComponent;
