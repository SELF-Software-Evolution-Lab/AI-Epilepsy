"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = exports.patientController = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const patientService_1 = require("../../services/patient/patientService");
class PatientController {
    constructor() {
        this.service = new patientService_1.PatientService();
        this.create = async (req, res) => {
            const _params = req._data();
            const response = await this.service.insertOrUpdate(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.update = async (req, res) => {
            const _params = req._data();
            const response = await this.service.insertOrUpdate(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.list = async (req, res) => {
            const _params = req._data();
            const response = await this.service.list(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.delete = async (req, res) => {
            const _params = req._data();
            const response = await this.service.delete(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.get = async (req, res) => {
            const _params = req._data();
            const response = await this.service.get(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
        this.test = async (req, res) => {
            const _params = req._data();
            const response = await this.service.test(_params);
            return responseUtility_1.responseUtility.build(res, response);
        };
    }
}
exports.PatientController = PatientController;
exports.patientController = new PatientController();
//# sourceMappingURL=patientController.js.map