const Patient = require('../models/patient')


exports.getPatients = (req,res,next) => {

    Patient.fecthAll()
    .then(result => {
        res.json(result[0])
       })
       .catch(err => {
        console.log(err)
       })
}


exports.getPatientByDocumentId = (req,res,next) => {

    const id = req.params.patientId

    Patient.findByDocumentId(id)
    .then(result => {
        
        res.json(result[0])
       })
       .catch(err => {
        console.log(err)
       })
        

}