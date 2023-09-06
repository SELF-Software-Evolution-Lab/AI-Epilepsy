const db = require('../Utils/dataBase')
const path = require('path')


module.exports = class Patient {
    constructor(id,document_id, fist_name, last_name, age,blood_type,gender,emergency_contact_name,emergency_contact_phone){

        this.id = id
        this.document_id = document_id
        this.fist_name = fist_name
        this.last_name = last_name
        this.age = age
        this.gender = gender
        this.blood_type = blood_type
        this.email = this.email
        this.emergency_contact_name = emergency_contact_name
        this.emergency_contact_phone = emergency_contact_phone

    }


    // add patient to the db
    save() {        
        
    }

    //delete a patient form the db

    static deleteById(id){
        
    }

    static fecthAll() {
    
      return db.execute('SELECT * FROM patient where id_patient < 20')
      
    }

    static findByDocumentId (id) {
        return db.execute(`SELECT * FROM patient where document_id = ${id}`)
    }

    static findByIDOrName(input){

        return db.execute('SELECT * FROM patient where id_patient < 20')
       
    }
}