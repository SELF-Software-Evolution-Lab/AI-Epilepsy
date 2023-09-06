const {sendMessage} = require('../Utils/rabbit')
module.exports = class QueueBufffer {
    static predict(message,name) {
        try{
            sendMessage(message,name)
            return `La predicción está haciendo procesada`
        }catch( error){
            console.log("Error:",error)
            return 'error al poner el mensaje en la cola'
        }
    }
}