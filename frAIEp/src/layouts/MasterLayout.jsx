import NavBarV2 from "./../components/NavBarV2";
import "./MasterLayout.css"
import * as React from "react";

export default function MasterLayout({children, useContainer = true}) {
  return (
    <>
      <NavBarV2 />
      <div className="bg-dark">
        <div className={`${useContainer? "container": ""} main-container bg-dark h-100`}>
          {
            children
          }
        </div>
      </div>
    </>
  )
}
