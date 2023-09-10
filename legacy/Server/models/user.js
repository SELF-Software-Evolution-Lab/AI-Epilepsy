
const path = require('path')


module.exports = class User {
    constructor(id,document_id, fist_name, last_name, age,type,gender,phone){

        this.id = id
        this.document_id = document_id
        this.fist_name = fist_name
        this.last_name = last_name
        this.age = age
        this.gender = gender
        this.type = type
        this.email = this.email
        this.phone = phone
       

    }


    // add User to the db
    save() {        
        
    }

    //delete a user form the db

    static deleteById(id){
        
    }

    static fecthAll() {
        
        
    }

    static findById(id){
       
    }
}