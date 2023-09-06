const express = require('express')

const router = express.Router()

const notificationController = require('../controllers/notification')


router.get('/notifications',notificationController.getAllNotification)

router.post('/create-notification',notificationController.createNotification)

module.exports = router
