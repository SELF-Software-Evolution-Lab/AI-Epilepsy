"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.authController = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const authService_1 = require("../../services/auth/authService");
class AuthController {
    constructor() {
        this.service = new authService_1.AuthService();
        this.login = async (req, res) => {
            const _params = req._data();
            const response = await this.service.login(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.signUp = async (req, res) => {
            const _params = req._data();
            const response = await this.service.signUp(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.test = async (req, res) => {
            const _params = req._data();
            const response = await this.service.test(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=authController.js.map