const express = require('express')

const router = express.Router()

const patientController = require('../controllers/patient')

router.get('/patients',patientController.getPatients )

router.get('/patients/:patientId',patientController.getPatientByDocumentId)

module.exports = router
