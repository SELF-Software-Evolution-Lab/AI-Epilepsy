"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoute = void 0;
//@IMPORT: Controllers
const eventController_1 = require("../controllers/event/eventController");
//@IMPORT: Utils
const routerUtility_1 = require("../../core/routerUtility");
const authMiddleware_1 = require("../middleware/authMiddleware");
class EventRoute {
    constructor(app, prefix) {
        this.className = 'EventRoute';
        this.controller = new eventController_1.EventController();
        this.prefix = '/events';
        this.routes = [
            { method: 'post', path: '/create', handler: this.controller.create, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/update/:id', handler: this.controller.update, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/delete/:id', handler: this.controller.delete, middleware: [authMiddleware_1.request] },
            { method: 'get', path: '/', handler: this.controller.list, middleware: [authMiddleware_1.request] },
            { method: 'get', path: '/:id', handler: this.controller.get, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/test', handler: this.controller.test, middleware: [authMiddleware_1.request] }
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
exports.EventRoute = EventRoute;
//# sourceMappingURL=eventRoute.js.map