"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the 'App' class from the '@app/app' module
const app_1 = require("./app");
// Create an instance of the 'App' class
const app = new app_1.App();
// Initialize the 'App' instance
app.init();
// Set a timeout to connect to the inbound queue service after 1000 milliseconds (1 second)
setTimeout(() => {
    // Call the 'connect_inbound' method of the 'queueService'
    //queueService.connect_inbound()
}, 1000);
//# sourceMappingURL=server.js.map