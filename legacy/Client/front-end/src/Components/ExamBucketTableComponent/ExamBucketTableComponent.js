import React, {useState} from "react";

const ExamBucketTableComponent = ({ rows, setExam, closeModal}) => {
  const headers = ["", "Nombre", "Path", "Fecha"];
  const [selectedExam, setSelectedExam] = useState(-1);

  const handleExamSelection = (event) => {
    setSelectedExam(event.target.value); 
    console.log(event.target.value)
  };

  const selectExam = () => {
    const selected = rows[selectedExam]
    const exam = [selected]
    setExam(exam)
    closeModal()
  };

  return (
    <div>
      <table class="styled-table-be">
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
              <td>
                <input type="radio" value={i} name="exam" onChange={handleExamSelection}></input>
              </td>
              <td>{row.exam_id}</td>
              <td className="file-rp">{row.storage_path}</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section className="upload-exam-buttons">
        <button onClick={selectExam} className="select-exam-button">
          Seleccionar Exámen
        </button>
      </section>
    </div>
  );
};

export default ExamBucketTableComponent;
