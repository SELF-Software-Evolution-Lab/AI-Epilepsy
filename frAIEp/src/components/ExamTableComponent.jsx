import React from "react";
import ExamHistory from "./../pages/ExamHistory";
import moment from "moment";

const ExamsTableComponent = ({rows, handleClick}) => {
  const headers = ['No.','ID Examen', 'Fecha', 'Accionables']

  const handleDowload = () => {
    console.log("Se clickeo download")
  }

  return (
    <div>
      <table className="styled-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id}>
              <td>{i+1}</td>
              <td>{row.id}</td>

              <td>{moment.utc(row.created_at).format('hh:mm A - YY-MM-DD')}</td>
              <td>
              <button
                  className='event-detail-button'
                  onClick={handleClick(row.id)}
              >Ver detalle</button>
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
