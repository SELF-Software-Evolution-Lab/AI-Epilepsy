const express = require('express')

const router = express.Router()

const predictionController = require('../controllers/prediction')


router.get('/predictions/:patientId',predictionController.getPredictionByPatient)

router.get('/prediction/:predictionId',predictionController.getPredictionById)

router.post('/predict/:patientId',predictionController.predict)

router.post('/create-prediction/:patientId', predictionController.createPrediction)

module.exports = router
