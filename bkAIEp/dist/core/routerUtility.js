"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterUtility = void 0;
/**
* Utility class for managing routes in Express.
* @class RouterUtility
*/
class RouterUtility {
    /**
    * Creates an instance of RouterUtility.
    * @param {Application} app - The Express application instance.
    * @param {string} prefix - The prefix for all routes managed by this utility.
    * @memberof RouterUtility
    */
    constructor(app, prefix) {
        this.app = app;
        this.prefix = prefix;
    }
    /**
    * Define a route based on the provided parameters.
    * @param {IRouteParams} _params - The route parameters.
    * @memberof RouterUtility
    */
    route(_params) {
        try {
            // Define a route using Express application instance.
            // Combines the route path with the utility's prefix and sets middleware and handler.
            this.app[_params.method](`${this.prefix}${_params.path}`, _params.middleware, _params.handler);
        }
        catch (error) {
            // Log any errors that occur during route definition.
            console.log('error', error);
        }
    }
}
exports.RouterUtility = RouterUtility;
//# sourceMappingURL=routerUtility.js.map