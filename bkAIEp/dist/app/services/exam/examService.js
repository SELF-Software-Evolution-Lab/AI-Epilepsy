"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamService = exports.examService = void 0;
const randomstring_1 = __importDefault(require("randomstring"));
const responseUtility_1 = require("../../../core/responseUtility");
const models_1 = require("../../models");
const sequelize_1 = require("sequelize");
const finderService_1 = require("../../services/finder/finderService");
const moment_1 = __importDefault(require("moment"));
const ftpUtility_1 = require("../../../core/ftpUtility");
const node_fs_1 = __importDefault(require("node:fs"));
const examModel_1 = require("../../models/examModel");
const uuid_1 = require("uuid");
const adm_zip_1 = __importDefault(require("adm-zip"));
const PATH = '/home/ftpuser/public_html';
class ExamService {
    constructor() { }
    /**
    * Inserts or updates an exam record based on the presence of 'id' in _params.
    * @param _params - Exam parameters.
    * @returns Promise<{exam: Exam}> - Promise containing the exam object.
    */
    async insertOrUpdate(_params) {
        try {
            if (_params.id) {
                // Update existing exam
                const exists = await models_1.Exam.findOne({ where: { id: _params.id } });
                if (!exists)
                    return responseUtility_1.responseUtility.error('exam.not_found');
                const _exam = await models_1.Exam.update(_params, { where: { id: _params.id } });
                const exam = await models_1.Exam.findOne({ where: { id: _params.id } });
                return responseUtility_1.responseUtility.success({ exam: exam });
            }
            else {
                // Insert new exam
                if (_params.type === 'mri' || _params.type === 'arn' || _params.type === 'eeg') {
                    // Validate required fields for specific exam types
                    if (!_params.source)
                        return responseUtility_1.responseUtility.error('exam.insert_update.no_source');
                    if (!_params.detail)
                        return responseUtility_1.responseUtility.error('exam.insert_update.no_detail');
                    if (!_params.file)
                        return responseUtility_1.responseUtility.error('exam.insert_update.no_file');
                    if (!_params.type)
                        return responseUtility_1.responseUtility.error('exam.insert_update.no_type');
                    if (!_params.patient_id)
                        return responseUtility_1.responseUtility.error('exam.insert_update.no_patient_id');
                    // Convert exam type to lowercase
                    _params.type = _params.type.toLowerCase();
                    // Generate a random string for the file name
                    const _r = randomstring_1.default.generate(7);
                    const _n = _params.file.split('.');
                    const new_name = `${_r}.${_n[_n.length - 1]}`;
                    const path = `${PATH}/patient/${_params.patient_id}/${_params.type}`;
                    // Update file path and name in the exam parameters
                    _params.path = `${path}/${new_name}`;
                    _params.file = new_name;
                    // Transfer the file to the specified path
                    const transfer = await finderService_1.finderService.transfer({ from: _params.source, to: path, file: new_name });
                    if (transfer.status === 'error')
                        return transfer;
                }
                // Create an event for the new exam
                const __event = {
                    detail: moment_1.default.utc().toISOString(),
                    person: "Zadiaz",
                    type: `Examen ${_params.type}`,
                };
                // Save the event to the database
                const _event = await models_1.Event.create(__event);
                const event = _event.toJSON();
                // Create the exam record
                const _exam = await models_1.Exam.create(_params);
                const exam = _exam.toJSON();
                return responseUtility_1.responseUtility.success({ exam, event });
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('exam.insert_update.fail_action');
        }
    }
    /**
    * Retrieves a list of exams based on the provided parameters.
    * @param _params - Query parameters for filtering exams.
    * @returns Promise<{exams: Exam[]}> - Promise containing the list of exams.
    */
    async list(_params) {
        try {
            const { page, number } = _params;
            // Construct the query based on provided parameters
            const query = {
                where: {},
            };
            if (_params.patient_id) {
                query.where['patient_id'] = {
                    [sequelize_1.Op.eq]: _params.patient_id
                };
            }
            if (_params.type) {
                query.where['type'] = {
                    [sequelize_1.Op.eq]: _params.type.toUpperCase()
                };
            }
            if (page && number) {
                query['limit'] = number;
                query['offset'] = (page - 1) * number;
            }
            const exams = await models_1.Exam.findAll(query);
            return responseUtility_1.responseUtility.success({ exams });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Deletes an exam record based on the provided parameters.
    * @param _params - Parameters for identifying the exam to be deleted.
    * @returns Promise<{exam: Exam}> - Promise containing the deleted exam object.
    */
    async delete(_params) {
        try {
            // Check if the exam exists
            const exists = await models_1.Exam.findOne({ where: { id: _params.id } });
            // Delete the exam record
            if (!exists)
                return responseUtility_1.responseUtility.error('exam.not_found');
            await models_1.Exam.destroy({ where: { id: _params.id } });
            // Return the deleted exam
            return responseUtility_1.responseUtility.success({ exam: exists });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('exam.list.fail_action');
        }
    }
    /**
    * Retrieves details of a specific exam based on the provided parameters.
    * @param _params - Parameters for identifying the exam to be retrieved.
    * @returns Promise<{exam: Exam}> - Promise containing the retrieved exam object.
    */
    async get(_params) {
        try {
            const exam = await models_1.Exam.findOne({ where: { id: _params.id } });
            if (!exam)
                return responseUtility_1.responseUtility.error('exam.not_found');
            return responseUtility_1.responseUtility.success({ exam });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('exam.get.fail_action');
        }
    }
    /**
    * A placeholder method for testing purposes.
    * @param _params - Parameters for the test.
    */
    async test(_params) {
        try {
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
     * Will check if the MRI test exists in cache folder. If so, will return an array of Series folders names 200 OK response.
     * Otherwise, it will retrieve and unzip the exam file, and return the list once done
     * @param _params
     */
    async requestMRITest(_params) {
        try {
            const exam = await examModel_1.ExamModel.findOne({ where: { id: _params.id } });
            if (!exam)
                return responseUtility_1.responseUtility.error('exam.not_found');
            const patientID = exam.patient_id;
            const examID = exam.id;
            const tempPath = exam.path.replace("{{EXAMID}}", exam.id.toString()); // mri/{patientID}/{examID} with values filled out
            const directory_exists = node_fs_1.default.existsSync(`temp/${tempPath}`);
            if (directory_exists) {
                // get a list of all folders in the directory
                const files = node_fs_1.default.readdirSync(`temp/${tempPath}`);
                return responseUtility_1.responseUtility.success({ "files": files, "status": "returned list of files" }, 200);
            }
            else {
                // Get zip from FTP
                console.log("zip file not found, downloading from FTP");
                let zipFileName = `user-${patientID}-exam-${examID}.zip`;
                if (!node_fs_1.default.existsSync(`temp/mri-download/${zipFileName}`)) {
                    // If the zip file doesn't exist, download it from the FTP server
                    const connection = _params.connection || (0, uuid_1.v4)();
                    try {
                        // Search for the zip file in the FTP server
                        await ftpUtility_1.ftpUtility.connect(connection);
                        await ftpUtility_1.ftpUtility.cd(connection, "/home/user/mri-exams", true);
                        const lsResponse = await ftpUtility_1.ftpUtility.ls(connection);
                        const files = lsResponse.files;
                        if (!files.find(e => e.name === zipFileName)) {
                            // Return error if zip file is not found
                            return responseUtility_1.responseUtility.error('exam.mri.get.not_found');
                        }
                        else {
                            // Download the zip file if the desired zip file is found
                            if (!node_fs_1.default.existsSync(`temp/mri-download`)) {
                                node_fs_1.default.mkdirSync(`temp/mri-download`, { recursive: true });
                            }
                            await ftpUtility_1.ftpUtility.downloadTo(connection, `temp/mri-download/${zipFileName}`, `/home/user/mri-exams/${zipFileName}`);
                        }
                    }
                    catch (e) {
                        console.log('error while connecting to FTP and downloading zip file', e);
                        return responseUtility_1.responseUtility.error('exam.mri.ftp_failure');
                    }
                }
                // Once we know the zip is in our server, we unzip it
                const zipPath = `temp/mri-download/${zipFileName}`;
                let zipfile = new adm_zip_1.default(zipPath);
                try {
                    console.log("unzipping file at ", zipPath);
                    zipfile.extractAllTo(`temp/mri/`, true);
                }
                catch (e) {
                    console.log('error while unzipping', e);
                    return responseUtility_1.responseUtility.error('exam.mri.unzip_failure');
                }
                const directory_exists = node_fs_1.default.existsSync(`temp/${tempPath}`);
                if (directory_exists) {
                    // get a list of all folders in the directory
                    const files = node_fs_1.default.readdirSync(`temp/${tempPath}`);
                    return responseUtility_1.responseUtility.success({
                        "files": files,
                        "status": "returned list of series",
                        "path": `temp/${tempPath}`
                    }, 200);
                }
                else {
                    console.log(`error while unzipping, the completed folder ${tempPath} was not found`);
                    return responseUtility_1.responseUtility.error('exam.mri.unzip_failure');
                }
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('exam.get.fail_action');
        }
    }
    /**
     * Will attempt to retrieve a list of images in the series folder given the following URL
     * /exams/mri/{examID}/{seriesID}/file_list.dcm
     * @param _params
     */
    async requestMRIFileList(_params) {
        try {
            const exam = await examModel_1.ExamModel.findOne({ where: { id: _params['examID'] } });
            if (!exam)
                return responseUtility_1.responseUtility.error('exam.not_found');
            const patientID = exam.patient_id;
            const examID = exam.id;
            const seriesID = _params['seriesID'];
            const tempPath = exam.path.replace("{{EXAMID}}", exam.id.toString()); // mri/{patientID}/{examID} with values filled out
            const directory_exists = node_fs_1.default.existsSync(`temp/${tempPath}`);
            if (directory_exists) {
                if (!node_fs_1.default.existsSync(`temp/${tempPath}/${seriesID}`)) {
                    console.log(`the series folder ${seriesID} was not found`);
                    return responseUtility_1.responseUtility.error('exam.mri.series_folder_not_found');
                }
                // get a list of all folders in the directory
                const files = node_fs_1.default.readdirSync(`temp/${tempPath}/${seriesID}/`);
                return responseUtility_1.responseUtility.success({ "files": files, "deliver_list": true }, 200);
            }
            else {
                console.log(`the folder ${tempPath} was not found`);
                return responseUtility_1.responseUtility.error('exam.mri.exam_folder_not_found');
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('exam.get.fail_action');
        }
    }
    /**
     * Will attempt to retrieve the path of an image given the following URL
     * @param _params
     */
    async requestMRIFile(_params) {
        try {
            const exam = await examModel_1.ExamModel.findOne({ where: { id: _params['examID'] } });
            if (!exam)
                return responseUtility_1.responseUtility.error('exam.not_found');
            const patientID = exam.patient_id;
            const examID = exam.id;
            const seriesID = _params['seriesID'];
            const filename = _params['filename'];
            const tempPath = exam.path.replace("{{EXAMID}}", exam.id.toString()); // mri/{patientID}/{examID} with values filled out
            const fullImagePath = `temp/${tempPath}/${seriesID}/${filename}`;
            const directory_exists = node_fs_1.default.existsSync(fullImagePath);
            if (directory_exists) {
                return responseUtility_1.responseUtility.success({ "file": `temp/${tempPath}/${seriesID}/${filename}`, "deliver_file": true }, 200);
            }
            else {
                console.log(`the image ${fullImagePath} was not found`);
                return responseUtility_1.responseUtility.error('exam.mri.mri_file_not_found');
            }
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('exam.get.fail_action');
        }
    }
}
exports.ExamService = ExamService;
exports.examService = new ExamService();
//# sourceMappingURL=examService.js.map