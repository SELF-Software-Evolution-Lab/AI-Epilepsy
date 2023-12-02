"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
/**
* Middleware function that enhances the request object by adding a `_data` function.
* The `_data` function returns an object containing parameters from `req.params`, `req.query`, and `req.body`.
* @returns {Function} Middleware function to be used in Express routes.
*/
const request = () => {
    return (req, res, next) => {
        // Define a `_data` function in the request object
        req._data = () => ({ ...req.params, ...req.query, ...req.body });
        // Call the next middleware or route handler in the chain
        next();
    };
};
exports.request = request;
//# sourceMappingURL=requestMiddleware.js.map