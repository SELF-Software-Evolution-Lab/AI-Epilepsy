const db = require('../Utils/dataBase')
const crypto = require("crypto");
const {getCurrentDate} = require('../Utils/dateFormater')


module.exports = class Notification {
    constructor(id, date, detail){

        this.id = id
        this.dateTime = date
        this.detail = detail
        
    }


    static fetchAllnotifications(){
        return db.execute(`SELECT * FROM notifications ORDER BY  dateTime desc`)
    }

    static createNotification(message){
        const id = crypto.randomBytes(16).toString("hex");
        const date = getCurrentDate()
        return db.execute(`INSERT INTO notifications (notification_id, dateTime, message)
        VALUES ('${id}', '${date}', '${message}');
        `)
    }
    

    
}