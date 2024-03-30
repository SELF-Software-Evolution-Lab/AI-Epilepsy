import React, { useEffect, useState } from "react";
import explorer from "./data/folderData";
import Folder from "./data/folder";
import File from "./data/file";
import { goTo } from "./../../services/finderService";
import { Modal, Button } from "react-bootstrap";
const ModalSelectFile = ({selected, setSelected, selectedName, setSelectedName}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [explorerData, setExplorerData] = useState(explorer);

  const openModal = () => {
    setIsOpen(true);
  };


  const handleGet = async (path =undefined) => {
    try{
      const response = goTo(path)
      return response
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(()=>{
    init()
  },[])

  const init = async() =>{
    const get = await handleGet("/home/user/examsToAssociate")
    if(get?.code === 200){
      if(get?.ftp?.files){
        setExplorerData(get?.ftp?.files)
      }
    }
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button className="select-exam-button" onClick={openModal}>
        {selected !== '' ? 'Cambiar archivo':'Seleccionar archivos'}
      </button>
      {isOpen && (
        <Modal centered size="lg" show={isOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selected !==  ''? `Archivo seleccionado: ${selected}` : 'Selecciona un archivo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            explorerData && Array.isArray(explorerData) ?
              explorerData.map(_f=>{
                if(_f.type === 'directory'){
                  return (<Folder data={_f} handleGet={handleGet} setSelected={setSelected} selected={selected} setSelectedName={setSelectedName} selectedName={selectedName}/>)
                } else {
                  return (<File data={_f} setSelected={setSelected} selected={selected} setSelectedName={setSelectedName}/>)
                }
              })
            : null
          }

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={closeModal}>
            Seleccionar
          </Button>
        </Modal.Footer>
      </Modal>
      )}
    </div>
  );
};

export default ModalSelectFile;
