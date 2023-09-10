
const PatientNotFoundComponent = () => {
    return (
        <div className="patient-not-found">
            <h1 className='titulo-principal-nf'>Paciente no encontrado</h1>
            <img className="not-found-icon" src={"/icons/404.png"}></img>
            <p> El Paciente que busca no existe <a href="/">Volver a la página principal</a></p>
            
        </div>
    );
}

export default PatientNotFoundComponent;
