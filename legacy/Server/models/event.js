const db = require('../Utils/dataBase')
const path = require('path')


module.exports = class Event {
    constructor(id,date, detail, format, file){

        this.id = id
        this.date = date
        this.detail = detail
        this.format = format
        this.file = file
    }


    // add patient to the db
    static fetchByPatient(document_id){
        return db.execute(`SELECT * FROM events where patient_id = "${document_id}"`)
    }
}