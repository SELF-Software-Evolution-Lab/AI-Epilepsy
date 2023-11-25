"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const patientRoute_1 = require("../routes/patientRoute");
const eventRoute_1 = require("../routes/eventRoute");
const examRoute_1 = require("../routes/examRoute");
const notificationRoute_1 = require("../routes/notificationRoute");
const predictionRoute_1 = require("../routes/predictionRoute");
const finderRoute_1 = require("../routes/finderRoute");
const authRoute_1 = require("../routes/authRoute");
class Routes {
    constructor(app) {
        this.prefix = '/api';
        this.app = app;
        this.patientRoute = new patientRoute_1.PatientRoute(this.app, this.prefix);
        this.eventRoute = new eventRoute_1.EventRoute(this.app, this.prefix);
        this.examRoute = new examRoute_1.ExamRoute(this.app, this.prefix);
        this.notificationRoute = new notificationRoute_1.NotificationRoute(this.app, this.prefix);
        this.predictionRoute = new predictionRoute_1.PredictionRoute(this.app, this.prefix);
        this.finderRoute = new finderRoute_1.FinderRoute(this.app, this.prefix);
        this.authRoute = new authRoute_1.AuthRoute(this.app, this.prefix);
    }
    init() {
        try {
            this.patientRoute.init();
            this.eventRoute.init();
            this.examRoute.init();
            this.notificationRoute.init();
            this.predictionRoute.init();
            this.finderRoute.init();
            this.authRoute.init();
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.Routes = Routes;
//# sourceMappingURL=index.js.map