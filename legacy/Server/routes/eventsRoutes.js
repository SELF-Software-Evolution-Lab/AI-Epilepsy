const express = require('express')

const router = express.Router()

const eventController = require('../controllers/event')

router.get('/events/:patientId',eventController.getEventsByPatient)

module.exports = router