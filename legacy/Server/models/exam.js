const db = require('../Utils/dataBase')
const path = require('path')


module.exports = class Exam {
    constructor(id,date, detail, format, file){

        this.id = id
        this.date = date
        this.detail = detail
        this.format = format
        this.file = file
    }


  /*   static createExam(patient_id, type, path, date ){
        const id = crypto.randomBytes(16).toString("hex");
        return db.execute(`INSERT INTO exams (exam_id, date, storage_path,type, patient_id)
        VALUES ('${id}', '${date}', '${path}', '${type}','${patient_id}');
        `)
    } */


    static fetchRecentMRI(document_id){
        return db.execute(`SELECT * FROM exams where patient_document_id = ${document_id} and type = 'MRI' ORDER BY date DESC
        LIMIT 1`)
    }

    static fetchRecentEEG(document_id){
        return db.execute(`SELECT * FROM exams where patient_document_id = ${document_id} and type = 'EEG' ORDER BY date DESC
        LIMIT 1`)
    }
    static fetchRecentANR(document_id){
        return db.execute(`SELECT * FROM exams where patient_document_id = ${document_id} and type = 'ARN' ORDER BY date DESC
        LIMIT 1`)
    }

    static fetchByTypeAndPatient(document_id,type){
        return db.execute(`SELECT * FROM exams where patient_document_id = ${document_id} and type = '${type}'`)
    }

    
}