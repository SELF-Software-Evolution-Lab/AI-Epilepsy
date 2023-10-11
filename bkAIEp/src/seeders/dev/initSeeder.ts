import { Event, Exam, Patient, Prediction } from '@app/models'
import { IConsole } from '@client/client'
import moment from 'moment'

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

    const events = [
      {
        datetime: moment.utc().toISOString(),
        person: "Zadiaz",
        type: "Consulta General",
        file: "patientes/{{1}}/file.mri"
      },
      {
        datetime: moment.utc().toISOString(),
        person: "Zadiaz",
        type: "Control",
        file: "patientes/{{1}}/file.eeg"
      }
    ]

    const exams = [
      {
        datetime: moment.utc().toISOString(),
        detail: "Detail del examen MRI",
        type: "MRI",
        file: "file.mri",
        path: "patientes/{{1}}/file.eeg"
      },
      {
        datetime: moment.utc().toISOString(),
        detail: "Detail del examen EEG",
        type: "EEG",
        file: "patientes/{{1}}/file.eeg",
        path: "patientes/{{1}}/file.eeg"
      }
    ]

    const predictions = [
      {
        date_requested:moment.utc().toISOString(),
        label:"Going"
      },
      {
        date_requested:moment.utc().toISOString(),
        label:"Stopped"
      }
    ]

    for (const patient of patients) {
      const exists = await Patient.findOne({
        where: {
          document_id: patient.document_id
        }
      })
      let _patient = exists
      if(exists){
        await Patient.update(patient, { where: { document_id: patient.document_id }})
      } else {
        _patient = await Patient.create(patient)
      }

      for (const event of events) {
        event.file = event.file.replace('{{1}}', _patient['id'])
        event['patient_id'] = _patient['id']
        await Event.create(event)
      }

      for (const exam of exams) {
        exam.file = exam.file.replace('{{1}}', _patient['id'])
        exam['patient_id'] = _patient['id']
        await Exam.create(exam)
      }

      for (const prediction of predictions) {
        prediction['patient_id'] = _patient['id']
        await Prediction.create(prediction)
      }
    }
    
  } catch (error) {
    console.log('error', error)
    return false
  }
  return true
}