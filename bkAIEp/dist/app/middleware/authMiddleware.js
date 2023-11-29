"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const responseUtility_1 = require("../../core/responseUtility");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
/**
* Middleware function that enhances the request object by adding a `_data` function.
* The `_data` function returns an object containing parameters from `req.params`, `req.query`, and `req.body`.
* @returns {Function} Middleware function to be used in Express routes.
*/
const request = async (req, res, next) => {
    const headers = JSON.parse(JSON.stringify(req.headers));
    if (!headers['authorization'] || !headers['authorization'].includes('Bearer ')) {
        const error = responseUtility_1.responseUtility.error('unauthorize', null, { code: 401 });
        return responseUtility_1.responseUtility.build(res, error);
    }
    else {
        let verify;
        try {
            verify = jsonwebtoken_1.default.verify(headers['authorization'].replace('Bearer ', ''), env_1.config.jwt);
        }
        catch (error) { }
        if (!verify.user) {
            const error = responseUtility_1.responseUtility.error('unauthorize', null, { code: 401 });
            return responseUtility_1.responseUtility.build(res, error);
        }
        else {
            req['params'].user_logged = verify.user;
        }
    }
    next();
};
exports.request = request;
//# sourceMappingURL=authMiddleware.js.map