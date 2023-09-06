import { Patient } from '@app/models'
import { IConsole } from '@client/client'

export const run = async(_params, console:IConsole) => {
  try{
    const patients = [
      {
        first_name: "Christos",
        last_name: "Tingcomb",
        email: "ctingcomb0@aboutads.info",
        gender: "male",
        age: 25,
        "document_id": 1026300124,
        "blood_type": "A+",
        "emergency_contact_name": "Christos Tingcomb",
        "emergency_contact_phone": "4128328536",
      },
      {
        first_name: "Pedro",
        last_name: "Garcia",
        email: "pedrodsgarcia@aboutads.info",
        gender: "male",
        age: 28,
        "document_id": 1026300132,
        "blood_type": "AB+",
        "emergency_contact_name": "Pedro Garcia",
        "emergency_contact_phone": "4128548536",
      }
    ]

    for (const patient of patients) {
      const exists = await Patient.findOne({
        where: {
          document_id: patient.document_id
        }
      })
      if(exists){
        await Patient.update(patient, { where: { document_id: patient.document_id }})
      } else {
        await Patient.create(patient)
      }
    }
    
  } catch (error) {
    console.log('error', error)
    return false
  }
  return true
}