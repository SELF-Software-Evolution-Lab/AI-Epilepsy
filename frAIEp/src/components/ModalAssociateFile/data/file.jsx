import './file.css'

export default function File({data, selected, setSelected, setSelectedName}) {
  return (
    <>
      <div onClick={()=>{setSelected(data.path); setSelectedName(data.name)}} className={`file ${selected === data.path? 'selected-file': ''}`}>
        {data.name}
      </div>
    </>
  )
}