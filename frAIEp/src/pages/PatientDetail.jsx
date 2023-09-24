import {  useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PatientCard from "./../components/PatientCard";
import ExamComponent from "./../components/ExamComponent";
import PredictionsTableComponent from "./../components/PredictionsTableComponent";
import EventTableComponent from "./../components/EventTablecomponent";

const PatientDetail = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const patient = location.state;
  const [toggleState, setToggleState] = useState(1);
  
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const handlePredictionRequest = () => {
    navigation("/request-prediction", { state: patient });
  };
  

  return (
    <div>
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "activeTabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          Información general
        </button>
        <button
          className={toggleState === 2 ? "activeTabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          Predicciones
        </button>
      </div>
      {toggleState == 1 ? (
        <div>
          <h1 className="titulo-principal">
            Perfil del Paciente {patient.first_name} {patient.last_name}
          </h1>
          <PatientCard patient={patient} context="patientDetail" />

          <h2 className="titulo-secundario">Historia clínica</h2>
          <button className="create-event-button">Registrar evento</button>
          <EventTableComponent patient={patient}/>
         

          <h2 className="titulo-secundario">Exámenes Disponibles</h2>
          <section className="exams-row">
            <ExamComponent
              type="examen"
              row={1}
              exam="MRI"
              description="Imágenes de resonancia magnética"
              img={"/icons/mri.png"}
              patient={patient}
            />
            <ExamComponent
              type="examen"
              row={1}
              exam="EEG"
              description="Registros de actividad cerebral"
              img={"/icons/eeg.png"}
              patient={patient}
            />
            <ExamComponent
              type="examen"
              row={1}
              exam="ARN"
              description="Perfiles de expresión en sangre"
              img={"/icons/arn.png"}
              patient={patient}
            />
          </section>
          <section className="exams-row">
            <ExamComponent
              type="examen"
              row={2}
              exam="Examen físico"
              description="Observación del estado físico del paciente"
              img={"/icons/phisicalTest.png"}
              patient={patient}
            />
            <ExamComponent
              type="examen"
              row={2}
              exam="Examen neuropsicológico"
              description="Test neuropsicológico para medir las habilidades motoras del paciente "
              img={"/icons/psicoTest.png"}
              patient={patient}
            />
            <ExamComponent
              type="medicamentos"
              row={2}
              exam="Medicación"
              description="Recetas médicas"
              img={"/icons/drugs.png"}
              patient={patient}
            />
          </section>
        </div>
      ) : (
        <div>
          <button
            onClick={handlePredictionRequest}
            className="create-event-button"
          >
            Solicitar Predicción
          </button>
          <PredictionsTableComponent patient={patient}/> 
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
