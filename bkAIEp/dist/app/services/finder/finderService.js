"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinderService = exports.finderService = void 0;
const uuid_1 = require("uuid");
const ftpUtility_1 = require("../../../core/ftpUtility");
const responseUtility_1 = require("../../../core/responseUtility");
class FinderService {
    constructor() { }
    /**
    * Navigates to a specified path on the FTP server.
    * @param {Object} _params - Object containing parameters for navigation.
    * @param {string} [_params.connection] - Optional connection identifier. If not provided, a unique identifier will be generated.
    * @param {string} [_params.path] - Optional path to navigate to.
    * @returns {Promise<Object>} A Promise containing the result of the navigation operation.
    */
    async goTo(_params) {
        try {
            // Generate a unique connection identifier if not provided
            const connection = _params.connection || (0, uuid_1.v4)();
            // Connect to the FTP server using the generated connection identifier
            await ftpUtility_1.ftpUtility.connect(connection);
            // Change directory to the specified path, if provided
            if (_params.path) {
                const cd = await ftpUtility_1.ftpUtility.cd(connection, _params.path);
            }
            // List the contents of the current directory
            const ftp = await ftpUtility_1.ftpUtility.ls(connection);
            // Get the current working directory
            const pwd = await ftpUtility_1.ftpUtility.pwd(connection);
            // Disconnect from the FTP server
            await ftpUtility_1.ftpUtility.disconnect(connection);
            // Return a success response with FTP information and the current path
            return responseUtility_1.responseUtility.success({
                ftp,
                path: pwd.path
            });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Transfers a file from one location to another on the FTP server.
    * @param {Object} _params - Object containing parameters for file transfer.
    * @param {string} [_params.connection] - Optional connection identifier. If not provided, a unique identifier will be generated.
    * @param {string} _params.from - Source path of the file.
    * @param {string} _params.to - Destination path of the file.
    * @param {string} _params.file - Name of the file to transfer.
    * @returns {Promise<Object>} A Promise containing the result of the file transfer operation.
    */
    async transfer(_params) {
        try {
            // Generate a unique connection identifier if not provided
            const connection = _params.connection || (0, uuid_1.v4)();
            // Connect to the FTP server using the generated connection identifier
            await ftpUtility_1.ftpUtility.connect(connection);
            // Validate the presence of 'from', 'to', and 'file' parameters
            if (!_params.from)
                return responseUtility_1.responseUtility.error('finder.transfer.not_from');
            if (!_params.to)
                return responseUtility_1.responseUtility.error('finder.transfer.not_to');
            // Move (transfer) the file from the source to the destination
            const transfer = await ftpUtility_1.ftpUtility.mov(connection, _params.from, _params.to, _params.file);
            // Disconnect from the FTP server
            await ftpUtility_1.ftpUtility.disconnect(connection);
            // Return a success response with the result of the file transfer
            return responseUtility_1.responseUtility.success({
                ...transfer
            });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * A test method that can be used for experimentation or development purposes.
    * @param {Object} _params - Parameters for the test method.
    * @returns {Promise<Object>} A Promise containing the result of the test operation.
    */
    async test(_params) {
        try {
            const connection = _params.connection || (0, uuid_1.v4)();
            await ftpUtility_1.ftpUtility.connect(connection);
            const tree = await ftpUtility_1.ftpUtility.getTreeCached(connection);
            return responseUtility_1.responseUtility.success({
                ...tree
            });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Retrieves the directory tree structure from the FTP server.
    * @param {Object} _params - Parameters for the tree retrieval method.
    * @returns {Promise<Object>} A Promise containing the directory tree structure.
    */
    async tree(_params) {
        try {
            // Generate a unique connection identifier if not provided
            const connection = _params.connection || (0, uuid_1.v4)();
            // Connect to the FTP server using the generated connection identifier
            await ftpUtility_1.ftpUtility.connect(connection);
            // Retrieve the directory tree structure from the FTP server
            const tree = await ftpUtility_1.ftpUtility.getTreeCached(connection);
            // Return a success response with the directory tree structure
            return responseUtility_1.responseUtility.success({
                ...tree
            });
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.FinderService = FinderService;
exports.finderService = new FinderService();
//# sourceMappingURL=finderService.js.map