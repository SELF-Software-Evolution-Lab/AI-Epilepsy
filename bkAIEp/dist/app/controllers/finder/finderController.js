"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinderController = exports.finderController = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const finderService_1 = require("../../services/finder/finderService");
class FinderController {
    constructor() {
        this.service = new finderService_1.FinderService();
        this.test = async (req, res) => {
            const _params = req._data();
            const response = await this.service.test(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.tree = async (req, res) => {
            const _params = req._data();
            const response = await this.service.tree(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.goTo = async (req, res) => {
            const _params = req._data();
            const response = await this.service.goTo(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.transfer = async (req, res) => {
            const _params = req._data();
            const response = await this.service.transfer(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
    }
}
exports.FinderController = FinderController;
exports.finderController = new FinderController();
//# sourceMappingURL=finderController.js.map