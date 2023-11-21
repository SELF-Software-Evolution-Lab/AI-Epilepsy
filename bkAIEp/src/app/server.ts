// Import the 'App' class from the '@app/app' module
import { App } from '@app/app'
// Import the 'queueService' from the '@app/services/queue/queueService' module
import { queueService } from '@app/services/queue/queueService'

// Create an instance of the 'App' class
const app = new App()

// Initialize the 'App' instance
app.init()

// Set a timeout to connect to the inbound queue service after 1000 milliseconds (1 second)
setTimeout(()=>{
  // Call the 'connect_inbound' method of the 'queueService'
  //queueService.connect_inbound()
}, 1000)
