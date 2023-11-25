"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamController = exports.examController = void 0;
const responseUtility_1 = require("../../../core/responseUtility");
const examService_1 = require("../../services/exam/examService");
class ExamController {
    constructor() {
        this.service = new examService_1.ExamService();
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
        this.requestMRITest = async (req, res) => {
            const _params = req._data();
            const response = await this.service.requestMRITest(_params);
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
        this.requestMRIFileList = async (req, res) => {
            const _params = req._data();
            const response = await this.service.requestMRIFileList(_params);
            if (response.deliver_list) {
                res.set({ "Content-Disposition": "attachment; filename=\"file_list.txt\"" });
                res.send(response.files.join('\n'));
            }
            else {
                return responseUtility_1.responseUtility.build(res, response);
            }
        };
        this.requestMRIFile = async (req, res) => {
            const _params = req._data();
            const response = await this.service.requestMRIFile(_params);
            if (response.deliver_file) {
                res.setHeader('content-type', 'application/dicom');
                return res.sendFile(response.file, { root: './' });
            }
            return responseUtility_1.responseUtility.build(res, response);
        };
    }
}
exports.ExamController = ExamController;
exports.examController = new ExamController();
//# sourceMappingURL=examController.js.map