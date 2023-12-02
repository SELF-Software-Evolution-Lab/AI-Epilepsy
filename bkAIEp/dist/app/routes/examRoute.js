"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRoute = void 0;
//@IMPORT: Controllers
const examController_1 = require("../controllers/exam/examController");
//@IMPORT: Utils
const routerUtility_1 = require("../../core/routerUtility");
const authMiddleware_1 = require("../middleware/authMiddleware");
class ExamRoute {
    constructor(app, prefix) {
        this.className = 'ExamRoute';
        this.controller = new examController_1.ExamController();
        this.prefix = '/exams';
        this.routes = [
            { method: 'post', path: '/create', handler: this.controller.create, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/update/:id', handler: this.controller.update, middleware: [authMiddleware_1.request] },
            { method: 'post', path: '/delete/:id', handler: this.controller.delete, middleware: [authMiddleware_1.request] },
            { method: 'get', path: '/request-mri/:id', handler: this.controller.requestMRITest, middleware: [authMiddleware_1.request] },
            { method: 'get', path: '/mri/:examID/:seriesID/file_list.*', handler: this.controller.requestMRIFileList, middleware: [authMiddleware_1.request] },
            { method: 'get', path: '/mri/:examID/:seriesID/:filename', handler: this.controller.requestMRIFile, middleware: [authMiddleware_1.request] },
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
exports.ExamRoute = ExamRoute;
//# sourceMappingURL=examRoute.js.map