"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
//@IMPORT: Controllers
const authController_1 = require("../controllers/auth/authController");
//@IMPORT: Utils
const routerUtility_1 = require("../../core/routerUtility");
const requestMiddleware_1 = require("../middleware/requestMiddleware");
class AuthRoute {
    constructor(app, prefix) {
        this.className = 'AuthRoute';
        this.controller = new authController_1.AuthController();
        // Prefix for authentication routes
        this.prefix = '/auth';
        // Array of route parameters for authentication routes
        this.routes = [
            { method: 'post', path: '/login', handler: this.controller.login, middleware: [] },
            { method: 'post', path: '/sign-up', handler: this.controller.signUp, middleware: [] },
            { method: 'post', path: '/test', handler: this.controller.test, middleware: [requestMiddleware_1.request] }
        ];
        this.app = app;
        this.routerUtility = new routerUtility_1.RouterUtility(this.app, `${prefix}${this.prefix}`);
    }
    /**
    * Initializes authentication routes by defining each route with its corresponding handler and middleware.
    */
    init() {
        for (const path of this.routes) {
            // Define each route using the RouterUtility
            this.routerUtility.route({
                method: path.method,
                path: path.path,
                handler: path.handler,
                middleware: path.middleware
            });
        }
    }
}
exports.AuthRoute = AuthRoute;
//# sourceMappingURL=authRoute.js.map