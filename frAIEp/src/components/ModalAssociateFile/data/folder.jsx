import { useEffect, useState } from "react"


import File from "./file";
import './folder.css'

export default function Folder({ data, handleGet, selected, setSelected, selectedName, setSelectedName }) {

  const [items, setItems] = useState([])
  const [required, setRequired] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    init()
  }, [])

  const init = async () => {
    if(!required) {
      setLoading(true)
      const get = await handleGet(data.path)
      if(get?.code === 200){
        if(get?.ftp?.files){
          setItems(get?.ftp?.files)
        }
      }
      setLoading(false)
    }
    setRequired(true)
  }

  return (
    <>
    <div className={`folder ${loading? 'folder-loading': ''}`}>
      <div className={`folder-name ${loading? 'folder-loading': ''}`} onClick={()=>{setOpen(!open)}}>
        📁 {data?.name}
      </div>
      {
        open ?
          <div className="folder-content">
            {
              items && items.length ?
                items.map(_f=>{
                  if(_f.type === 'directory'){
                    return (<Folder data={_f} handleGet={handleGet} setSelected={setSelected} selected={selected}  setSelectedName={setSelectedName} selectedName={selectedName}/>)
                  } else {
                    return (<File data={_f} setSelected={setSelected} selected={selected}  setSelectedName={setSelectedName}/>)
                  }
                })
              
              : null
            }

          </div>

        : null
      }
    </div>
    </>
  )
}