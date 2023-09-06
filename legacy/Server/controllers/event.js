const Event = require('../models/event')

exports.getEventsByPatient = (req,res,next) => {

    const patient_id = req.params.patientId
    

    Event.fetchByPatient(patient_id)
    .then(result => {
        res.json(result[0])
    })
    .catch(err => {
        console.log(err)
    })
}