import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import MasterLayout from "./../layouts/MasterLayout";
import { Button } from "react-bootstrap";
import { TbUserSearch} from "react-icons/tb"

export default function HomeV2() {
  const [search, setSearch] = useState('')
  const navigation = useNavigate()
  function handleSubmit() {
    if(search==='') return 
    navigation('/patients-v2',{ state:search})
  }

  function handleKey(e) {
    if(e.key === 'Enter'){
      handleSubmit()
    }
  }
  return (
    <>
      <MasterLayout>
        <div className="row justify-content-center">
          <div className="col-6 text-center">
            <br /><br /><br /><br />
            <img src="/banner.png" className="w-100"></img>
          </div>
        </div>
        <br /><br />
        <div className="row justify-content-center">
          <div className="col-8">
            <input type="text" onKeyDown={handleKey} onChange={(e)=> setSearch(e.target.value)} placeholder="Buscar pacientes" className="form-control text-white bg-dark shadow" />
          </div>
          <div className="col-1">
            <Button onClick={handleSubmit} variant="outline-info"><TbUserSearch /></Button>
          </div>
        </div>

      </MasterLayout>
    </>
  )
}