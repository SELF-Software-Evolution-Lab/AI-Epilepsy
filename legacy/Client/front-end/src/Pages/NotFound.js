import React from "react";

const NotFound = () => {
  return (
    <div className="page-not-found">
      <h1 className="titulo-principal-nf">Pagina no encontrada</h1>
      <img className="not-found-icon" src="/icons/404.png"></img>
      <p>
        {" "}
        La página que busca no existe{" "}
        <a href="/">Volver a la página principal</a>
      </p>
    </div>
  );
};

export default NotFound;
