const express = require('express')

const router = express.Router()

const examController = require('../controllers/exam')

router.get('/exams/:patientId',examController.getExamByPatientAndType)

router.get('/recent-MRI/:patientId', examController.getRecentMRIByPatient)
router.get('/recent-EEG/:patientId', examController.getRecentEEGByPatient)
router.get('/recent-ARN/:patientId', examController.getRecentARNByPatient)

module.exports = router