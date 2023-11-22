import { useEffect, useState, useContext } from "react";
import MasterLayout from "./../layouts/MasterLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { createExam, listExamsByPatient } from "../services/examService";
import moment from "moment";
import { Button, Modal } from "react-bootstrap";
import { listEventsByPatient } from "../services/eventService";
import { createPrediction, listPredictionByPatient } from "../services/predictionService";
import { treeCached } from "../services/finderService";
import Folder from "../components/ModalAssociateFile/data/folder";
import File from "../components/ModalAssociateFile/data/file";
import  Swal from 'sweetalert2'
import { BaseContext } from "../context/baseContext";

import {GiMagicPortal} from "react-icons/gi"


import './Patient.css'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  timer: 5000,
  timerProgressBar: true,
  showConfirmButton: false,
  width: '350px'
})

export default function Patient() {
  const location = useLocation();
  const patient = location.state
  const context = useContext(BaseContext)
  const navigation = useNavigate()
  const [exam, setExam] = useState('mri')
  const [result, setResult] = useState(null)

  
  const [loading, setLoading] = useState(false)
  
  const [modalExamCreate, setModalExamCreate] = useState(false)
  const [modalPredictionCreate, setModalPredictionCreate] = useState(false)
  const [modalExamFilesCreate, setModalExamFilesCreate] = useState(true)
  const [modalResult, setModalResult] = useState(false)
  const [modalDetailExam, setModalDetailExam] = useState(false)
  const [modalDetailEvent, setModalDetailEvent] = useState(false)

  const [detailExam, setDetailExam] = useState(null)

  
  const [tree, setTree] = useState(null)

  const [exams, setExams] = useState([])
  const [events, setEvents] = useState([])
  const [predictions, setPredictions] = useState([])

  const [selectedMRI, setSelectedMRI] = useState(null)
  const [selectedARN, setSelectedARN] = useState(null)
  const [selectedEEG, setSelectedEEG] = useState(null)

  const [selected, setSelected] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [observation, setObservation] = useState('');

  const createExamRequest = async()=>{
    setLoading(true)
    const response = await createExam({
      detail: observation,
      file: selectedName,
      source: selected,
      type: exam,
      patient_id: patient.id
    })
    if(response?.code === 200){
      Toast.fire({
        icon: 'success',
        title: 'Examen guardado'
      })

    } else {
      Toast.fire({
        icon: 'error',
        title: 'Examen no creado'
      })
    }
    await getExams()
    setModalExamCreate(false)
    setLoading(false)
  }

  const createPredictionRequest= async()=>{
    setLoading(true)
    const response = await createPrediction({
      mri: selectedMRI,
      arn: selectedARN,
      eeg: selectedEEG,
      patient_id: patient.id
    })
    if(response?.code === 200){
      Toast.fire({
        icon: 'success',
        title: 'Prediccion solicitada'
      })

    } else {
      Toast.fire({
        icon: 'error',
        title: 'Prediccion no solicitada'
      })
    }
    await getPredictions()
    setLoading(false)
    setModalPredictionCreate(false)
  }

  const handleExam = (exm) =>{
    setExam(exm)
  }

  const getDataExam = () =>{
    if(exam === 'mri'){
      return {name:'Resonancia Magnetica', description: 'Imágenes de resonancia magnética', has_file: true}
    } else if(exam === 'eeg'){
      return {name:'Electro-encefalograma', description: 'Registros de actividad cerebral', has_file: true}
    } else if(exam === 'arn'){
      return {name:'Micro ARN', description: 'Perfiles de expresión en sangre', has_file: true}
    } else if(exam === 'fis'){
      return {name:'Examen Fisico', description: 'Observación del estado físico del paciente'}
    } else if(exam === 'nes'){
      return {name:'Examen Neurosicologico', description: 'Test neuropsicológico para medir las habilidades motoras del paciente'}
    } else if(exam === 'med'){
      return {name:'Medicamentos', description: 'Recetas médicas'}
    }

  }

  useEffect(()=>{
    if(!patient) navigation('v2')
    getExams()
    getEvents()
    getPredictions()
    getTree()
  },[])

  const getExams = async() =>{
    const response_exams = await listExamsByPatient()
    if(response_exams.code === 200){
      response_exams.exams.sort((a,b)=> moment.utc(b.created_at).diff(moment.utc(b)))
      setExams(response_exams.exams)
    }
  }

  const getTree = async ()=>{
    const response_tree = await treeCached()
    if(response_tree.code === 200){
      setTree(response_tree.tree)
    }
  }
  const getEvents = async() =>{
    const response_events = await listEventsByPatient()
    if(response_events.code === 200){
      setEvents(response_events.events)
    }
  }
  const getPredictions = async() =>{
    const response_predictions = await listPredictionByPatient()
    if(response_predictions.code === 200){
      setPredictions(response_predictions.predictions)
    }
  }

  return (
    <>
      <MasterLayout>
        <div className="row">
          <div className="col-sm-7">
          <div className="row">
            <div className="col">
              <div className="card bg-dark border-info text-white mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src="/icons/patientAvatar.png" className="img-fluid rounded-start" alt="..." />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{patient.first_name} {patient.last_name}</h5>
                      <p>
                        Documento: <span className="fw-medium">{patient.document_id}</span> <br/>
                        RH: <span className="fw-medium"> {patient.blood_type}</span> <br/>
                        Genero: <span className="fw-medium"> {patient.gender === 'male' ? 'Masculino': 'Femenino'}</span> <br/>
                        Email: <span className="fw-medium"> {patient.email}</span> <br/>
                      </p>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            
            context.userCan('predictions', 'predictions:info') ? 
              <div className="row text-white">
                <div className="col">
                  <h4>
                    Predicciones
                    <Button className="mx-2" variant="info" onClick={()=> setModalPredictionCreate(!modalPredictionCreate)} size="sm">+</Button>
                  </h4>
                  {
                    predictions.length ? 

                      <table className="table table-dark table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Estado</th>
                            <th className="text-end" scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            predictions.map(_p=>{
                              return (
                                <tr key={_p.id}>
                                  <td>{_p.id}</td>
                                  <td>{moment.utc(_p.created_at).format('hh:mm A - YY-MM-DD')}</td>
                                  <td>{_p.label}</td>
                                  <td className="text-end">
                                    {
                                      _p.label === 'Stopped' ? 
                                        <Button onClick={()=>{setResult(_p); setModalResult(true)}} variant="outline-info" size="sm">Ver</Button>
                                      : null
                                    }
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>

                    : <div className="text-center text-info"> No hay eventos para mostrar </div>
                  }
                </div>
              </div>

            :null
          }
          {
            context.userCan('events', 'events:info') ?
              <div className="row text-white">
                <div className="col">
                  <h4>Historia clínica</h4>
                  {
                    events.length ? 

                      <table className="table table-dark table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Tipo de evento</th>
                            <th scope="col">Personal</th>
                            <th className="text-end" scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            events.map(_e=>{
                              return (
                                <tr key={_e.id}>
                                  <td>{_e.id}</td>
                                  <td>{moment.utc(_e.created_at).format('hh:mm A - YY-MM-DD')}</td>
                                  <td>{_e.type}</td>
                                  <td>{_e.person}</td>
                                  <td className="text-end">
                                    <Button variant="outline-info" size="sm">Ver</Button>
                                  </td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>

                    : <div className="text-center text-info"> No hay eventos para mostrar </div>
                  }
                </div>
              </div>
            : null
          }
          
          </div>
          <div className="col-sm-5">
          {
            context.userCan('exams', 'exams:info') ?
              <>
                <div className="row">
                  <div className="col">
                    <ul className="nav  justify-content-center">
                      {
                        context.userCan('exams', 'exams:mri') ? 
                          <li className="nav-item">
                            <a onClick={()=> handleExam('mri')} className={`btn mx-2 btn${exam === 'mri' ?'-outline' : ''}-info btn-sm`} >MRI</a>
                          </li>

                        : null
                      }
                      {
                        context.userCan('exams', 'exams:eeg') ? 
                          
                          <li className="nav-item">
                            <a onClick={()=> handleExam('eeg')} className={`btn mx-2 btn${exam === 'eeg' ?'-outline' : ''}-info btn-sm`} >EEG</a>
                          </li>
                        : null
                      }
                      {
                        context.userCan('exams', 'exams:arn') ? 
                          
                          <li className="nav-item">
                            <a onClick={()=> handleExam('arn')} className={`btn mx-2 btn${exam === 'arn' ?'-outline' : ''}-info btn-sm`} >ARN</a>
                          </li>
                        : null
                      }
                      {
                        context.userCan('exams', 'exams:nes') ? 
                          
                          <li className="nav-item">
                            <a onClick={()=> handleExam('nes')} className={`btn mx-2 btn${exam === 'nes' ?'-outline' : ''}-info btn-sm`} >Neurosicologico</a>
                          </li>
                        : null
                      }
                      {
                        context.userCan('exams', 'exams:fis') ? 
                          
                          <li className="nav-item">
                            <a onClick={()=> handleExam('fis')} className={`btn mx-2 btn${exam === 'fis' ?'-outline' : ''}-info btn-sm`} >Fisico</a>
                          </li>
                        : null
                      }
                      {
                        context.userCan('exams', 'exams:med') ? 
                          <li className="nav-item">
                            <a onClick={()=> handleExam('med')} className={`btn mx-2 btn${exam === 'med' ?'-outline' : ''}-info btn-sm`} >Medicamentos</a>
                          </li>
                          
                        : null
                      }
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col text-white">
                    <div className="text-end">
                      <h4>
                        { getDataExam().name} 
                        <Button className="mx-2" variant="info" onClick={()=> setModalExamCreate(!modalExamCreate)} size="sm">+</Button>
                      </h4>
                      <p>
                        { getDataExam().description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col text-white text-end">
                    {
                      exams.filter(_e=> _e.type.toLowerCase() === exam).length ? 
                        <>
                          <table className="table table-dark table-striped">
                            <thead>
                              <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Fecha</th>
                                <th className="text-end" scope="col">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                exams.filter(_e=> _e.type.toLowerCase() === exam).map(_e=>{
                                  return(
                                    <tr key={_e.id}>
                                      <td>{_e.id}</td>
                                      <td>{moment.utc(_e.created_at).format('hh:mm A - YY-MM-DD')}</td>
                                      <td>
                                        <Button onClick={()=>{setDetailExam(_e);setModalDetailExam(true)}} variant="outline-info" size="sm">Ver</Button>
                                      </td>
                                    </tr>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                        </>
                      : 
                        <div className="text-center text-info"> No hay examenes para mostrar </div>
                    }

                  </div>
                </div>
              </>
            : null
          }
          </div>
        </div>

        <Modal size="lg" scrollable={false} centered show={modalDetailEvent} onHide={()=> setModalDetailEvent(false)}>
          <Modal.Header className="bg-dark text-white" closeButton>
            <Modal.Title>Evento</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="info"  onClick={()=> setModalDetailEvent(false)}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal size="lg" scrollable={false} centered show={modalDetailExam} onHide={()=> setModalDetailExam(false)}>
          <Modal.Header className="bg-dark text-white" closeButton>
            <Modal.Title>Examen</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">

            <div className="col">
              <div className="row">
                <div className="col-sm-6">
                  <p>
                    <span>Detalle:</span> <span className="fw-bold">{detailExam?.detail}</span><br/>
                    <span>Archivo:</span> <span className="fw-bold">{detailExam?.file.replace("{{EXAMID}}", detailExam?.id)}</span><br/>
                    <span>Fecha:</span> <span className="fw-bold">{moment.utc(detailExam?.created_at).format('hh:mm A - YY-MM-DD')}</span><br/>
                    <span>Detalle:</span> <span className="fw-bold">{detailExam?.detail}</span><br/>
                  </p>
                </div>
                <div className="col-sm-6 text-center">
                </div>
              </div>

            </div>
            
            
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            {
              ["MRI", "EEG"].includes(detailExam?.type) ?
                <>
                  <Button variant="info"  onClick={()=>{navigation(`/patients/${detailExam?.patient_id}/exams/mri/${detailExam?.id}/`)}}>Visualizador <GiMagicPortal></GiMagicPortal></Button>
                </>
              : null
            }
            <Button variant="info"  onClick={()=> setModalDetailExam(false)}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal size="md" scrollable={false} centered show={modalResult} onHide={()=> setModalResult(false)}>
          <Modal.Header className="bg-dark text-white" closeButton>
            <Modal.Title>Informe Predictivo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <p>
              Nombre: <span>{patient.first_name} {patient.last_name}</span> <br/>
              Documento: <span className="fw-medium">{patient.document_id}</span> <br/>
              RH: <span className="fw-medium"> {patient.blood_type}</span> <br/>
              Genero: <span className="fw-medium"> {patient.gender === 'male' ? 'Masculino': 'Femenino'}</span> <br/>
              Email: <span className="fw-medium"> {patient.email}</span> <br/>
            </p>
            <p>
              Predicción general: 
              El modelo predictivo sugiere que, basado en los tres exámenes suministrados 
              ( MRI, EEG y micro ARNs), el paciente Christos Tingcomb es &nbsp; 
              {result?.result? 'POSITIVO': 'NEGATIVO'}
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="info"  onClick={()=> setModalResult(false)}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal size="lg" scrollable={false} centered show={modalExamCreate} onHide={()=> setModalExamCreate(false)}>
          <Modal.Header className="bg-dark text-white" closeButton>
            <Modal.Title>Crear examen {getDataExam().name?.toLowerCase()}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            {
              getDataExam().has_file ? 
                <>
                  <div className="text-center">
                    <Button onClick={()=> setModalExamFilesCreate(!modalExamFilesCreate)} size="sm" variant={`${modalExamFilesCreate ? 'outline-': ''}info`}>{modalExamFilesCreate? 'Ocultar': 'Mostrar'} selector de archivos</Button>
                  </div>
                  {
                    modalExamFilesCreate && tree && Array.isArray(tree) ?
                      tree.map(_f=>{
                        if(_f.type === 'directory'){
                          return (<Folder key={_f.path} data={_f}  setSelected={setSelected} selected={selected} setSelectedName={setSelectedName} selectedName={selectedName}/>)
                        } else {
                          return (<File key={_f.path} data={_f} setSelected={setSelected} selected={selected} setSelectedName={setSelectedName}/>)
                        }
                      })
                    : null
                  }
                  <div>
                    {
                      selectedName !== '' ? 
                        <>
                          <p>Archivo selecciona: {selectedName}</p>
                        </>
                      : null
                    }
                  </div>
                </>
              : null
            }
            <br/>
            <span className="mt-3">Observaciones: </span>
            <textarea onChange={(e)=> setObservation(e.target.value)} className="bg-dark text-white mt-1 w-100">

            </textarea>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="secondary" onClick={()=> setModalExamCreate(false)}>
              Cerrar
            </Button>
            <Button variant="info" disabled={getDataExam().has_file && observation === '' ? true : (observation === '' ? true : false)} onClick={()=> createExamRequest()}>
              {
                loading && 
                  <div className="spinner-border mx-1 text-light spinner-border-sm" role="status">
                    <span className="visually-hidden">Cargando</span>
                  </div>
              }
              Crear
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal size="md" centered show={modalPredictionCreate} onHide={()=> setModalPredictionCreate(false)}>
          <Modal.Header className="bg-dark text-white" closeButton>
            <Modal.Title>Crear solicitud de prediccion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            MRI: { 
              exams.filter(_e=> _e.type.toLowerCase() === 'mri').slice(0,3).map(_e=>{return(
                <Button onClick={()=> setSelectedMRI(_e)} key={_e.id} variant={`${selectedMRI?.id === _e.id? 'outline-' : '' }info`} size="sm" className="mx-1 my-1">{_e.id} - {moment.utc(_e.created_at).format('MM-DD')}</Button>
              )})
            }
            <Button onClick={()=> setSelectedMRI(null)} variant={`${selectedMRI === null? 'outline-' : '' }info`} size="sm" className="mx-1 my-1">N/A</Button>
            <br/>
            ARN: { 
              exams.filter(_e=> _e.type.toLowerCase() === 'arn').slice(0,3).map(_e=>{return(
                <Button onClick={()=> setSelectedARN(_e)} key={_e.id} variant={`${selectedARN?.id === _e.id? 'outline-' : '' }info`} size="sm" className="mx-1 my-1">{_e.id} - {moment.utc(_e.created_at).format('MM-DD')}</Button>
              )})
            }
            <Button onClick={()=> setSelectedARN(null)} variant={`${selectedARN === null? 'outline-' : '' }info`} size="sm" className="mx-1 my-1">N/A</Button>
            <br/>
            EEG: { 
              exams.filter(_e=> _e.type.toLowerCase() === 'eeg').slice(0,3).map(_e=>{return(
                <Button onClick={()=> setSelectedEEG(_e)} key={_e.id} variant={`${selectedEEG?.id === _e.id? 'outline-' : '' }info`} size="sm" className="mx-1 my-1">{_e.id} - {moment.utc(_e.created_at).format('MM-DD')}</Button>
              )})
            }
            <Button onClick={()=> setSelectedEEG(null)} variant={`${selectedEEG === null? 'outline-' : '' }info`} size="sm" className="mx-1 my-1">N/A</Button>
            <br/>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="secondary" onClick={()=> setModalPredictionCreate(false)}>
              Cerrar
            </Button>
            <Button variant="info"  onClick={()=> createPredictionRequest()}>
              Crear
            </Button>
          </Modal.Footer>
        </Modal>
      </MasterLayout>
    </>
  )
}