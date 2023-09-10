import React, { useState } from "react";
import explorer from "./data/folderData";
import Folder from "./Folder";

const ModalSelectFile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [explorerData, setExplorerData] = useState(explorer);

  const openModal = () => {
    setIsOpen(true);
    // document.body.style.overflow = 'hidden'; // prevent scrolling on background
  };

  const closeModal = () => {
    setIsOpen(false);
    // document.body.style.overflow = 'auto'; // enable scrolling on background
  };

  return (
    <div>
      <button className="select-exam-button" onClick={openModal}>
        Seleccionar archivos
      </button>
      {isOpen && (
        <div className="modal-page-container">
          <div className="modal-container">
            <h2 className="titulo-terciario-center_p">
              Exámenes disponibles en el contenedor del hospital
            </h2>

            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <Folder explorer={explorerData} />
            </div>
            <section className="upload-exam-buttons">
              <div className="button-fb-container">
                <button className="select-exam-button_fb">
                  Seleccionar Exámen
                </button>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalSelectFile;
