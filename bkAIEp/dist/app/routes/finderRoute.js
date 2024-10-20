"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinderRoute = void 0;
//@IMPORT: Controllers
const finderController_1 = require("../controllers/finder/finderController");
//@IMPORT: Utils
const routerUtility_1 = require("../../core/routerUtility");
const authMiddleware_1 = require("../middleware/authMiddleware");
class FinderRoute {
    constructor(app, prefix) {
        this.className = 'FinderRoute';
        this.controller = new finderController_1.FinderController();
        this.prefix = '/finder';
        this.routes = [
            { method: 'post', path: '/test', handler: this.controller.test, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/tree', handler: this.controller.tree, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/go-to', handler: this.controller.goTo, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/transfer', handler: this.controller.transfer, middleware: [authMiddleware_1.request] }
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
exports.FinderRoute = FinderRoute;
//# sourceMappingURL=finderRoute.js.map