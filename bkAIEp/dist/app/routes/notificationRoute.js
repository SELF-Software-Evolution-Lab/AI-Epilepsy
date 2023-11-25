"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoute = void 0;
//@IMPORT: Controllers
const notificationController_1 = require("../controllers/notification/notificationController");
//@IMPORT: Utils
const routerUtility_1 = require("../../core/routerUtility");
class NotificationRoute {
    constructor(app, prefix) {
        this.className = 'NotificationRoute';
        this.controller = new notificationController_1.NotificationController();
        this.prefix = '/notifications';
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
exports.NotificationRoute = NotificationRoute;
//# sourceMappingURL=notificationRoute.js.map