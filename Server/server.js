const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express()
const patientRoutes = require('./routes/patientRoutes')
const examsRoutes = require('./routes/examRoutes')
const predictionRoutes = require('./routes/predictionRoutes')
const notificationRoutes = require ('./routes/notificationRoutes')
const eventsRoutes = require ('./routes/eventsRoutes')

app.use(bodyParser.json());


// use it before all route definitions
app.use(cors({origin: 'http://epilepsy-frontend:4000'}));



app.use(patientRoutes)
app.use(examsRoutes)
app.use(predictionRoutes)
app.use(notificationRoutes)
app.use(eventsRoutes)


app.listen(4000, () => {
    console.log(" app listening at 4000 port")
})