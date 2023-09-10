const db = require('../Utils/dataBase')
const crypto = require('crypto');
const {getCurrentDate} = require('./../Utils/dateFormater')


module.exports = class Prediction {
    constructor(id,date_requested, label, patient_id){

        this.id = id
        this.date_requested = date_requested
        this.patient_id = patient_id
        this.label = label
        
    }


    static fetchByPatient(document_id){
        return db.execute(`SELECT * FROM predictions where patient_document_id = ${document_id} ORDER BY date_requested DESC`)
    }

    static fetchById(id){
        return db.execute(`SELECT * FROM predictions where prediction_id = "${id}"`)
    }


    static createPrediction(document_id){
        const id = crypto.randomBytes(16).toString("hex");
        const date = getCurrentDate()
        try{
            db.execute(`INSERT INTO predictions (prediction_id, date_requested, patient_document_id, label)
            VALUES ('${id}', '${date}', '${document_id}', '');
            `)
            return id
        }catch(err){
            console.log(err)
        }
         
    }

    static updatePrediction(id, message){
        return db.execute(`UPDATE predictions SET label = '${message}' WHERE prediction_id = '${id}'`)
    }
   
}