const Notification = require('../models/notification')

exports.getAllNotification = (req,res,next) => {
    Notification.fetchAllnotifications()
    .then(result =>{
        
        res.json(result[0])
    })
    .catch(err => {
        console.log(err)
       })
}

exports.createNotification = (req,res,next) => {
    const body = req.body
    
    const message = JSON.stringify(body)

    Notification.createNotification(message)
    .then(
        res.send("Se creo la notificación exitosamente")
    )
    .catch(err => {
        console.log(err)
    })
}