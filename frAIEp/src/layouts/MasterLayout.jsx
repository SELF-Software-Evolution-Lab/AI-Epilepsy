import NavBarV2 from "../components/NavBarV2";
import "./MasterLayout.css"

export default function MasterLayout(props) {
  return (
    <>
      <NavBarV2 />
      <div className="bg-dark">
        <div className="container main-container bg-dark h-100">
          {
            props?.children
          }
        </div>
      </div>
    </>
  )
}