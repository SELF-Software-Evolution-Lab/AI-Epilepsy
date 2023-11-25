"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRoute = void 0;
//@IMPORT: Controllers
const patientController_1 = require("../controllers/patient/patientController");
//@IMPORT: Utils
const routerUtility_1 = require("../../core/routerUtility");
class PatientRoute {
    constructor(app, prefix) {
        this.className = 'PatientRoute';
        this.controller = new patientController_1.PatientController();
        this.prefix = '/patients';
        this.routes = [
            { method: 'post', path: '/create', handler: this.controller.create, middleware: [] },
            { method: 'post', path: '/update/:id', handler: this.controller.update, middleware: [] },
            { method: 'post', path: '/delete/:id', handler: this.controller.delete, middleware: [] },
            { method: 'get', path: '/', handler: this.controller.list, middleware: [] },
            { method: 'get', path: '/:id', handler: this.controller.get, middleware: [] },
            { method: 'post', path: '/test', handler: this.controller.test, middleware: [] }
        ];
        this.app = app;
        this.routerUtility = new routerUtility_1.RouterUtility(this.app, `${prefix}${this.prefix}`);
    }
    init() {
        for (const path of this.routes) {
            this.routerUtility.route({
                method: path.method,
                path: path.path,
                handler: path.handler,
                middleware: path.middleware
            });
        }
    }
}
exports.PatientRoute = PatientRoute;
//# sourceMappingURL=patientRoute.js.map