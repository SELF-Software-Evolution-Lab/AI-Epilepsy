"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtpUtility = exports.ftpUtility = void 0;
const basic_ftp_1 = require("basic-ftp");
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const env_1 = require("../config/env");
const responseUtility_1 = require("./responseUtility");
/**
* Utility class for handling FTP connections and actions.
* @class FtpUtility
*/
class FtpUtility {
    /**
    * Creates an instance of FtpUtility.
    * @memberof FtpUtility
    */
    constructor() {
        /**
        * Establish an FTP connection.
        * @param {string} key - Unique key to identify the connection.
        * @returns {Promise<any>} A promise that resolves to the success response.
        * @memberof FtpUtility
        */
        this.connect = async (key) => {
            try {
                const _config = env_1.config.ftp;
                const connection = _config.connections[0];
                this.connections[key] = new basic_ftp_1.Client(0);
                this.connections[key].ftp.verbose = false;
                await this.connections[key].access(connection);
                return responseUtility_1.responseUtility.success();
            }
            catch (error) {
                console.log('error', error);
            }
        };
        /**
        * Disconnect from an FTP connection.
        * @param {string} connection - The key identifying the connection to disconnect.
        * @memberof FtpUtility
        */
        this.disconnect = async (connection) => {
            try {
                this.connections[connection]?.close();
                this.connections[connection] = undefined;
            }
            catch (error) {
                console.log('error', error);
            }
        };
        this.connections = [];
        // Periodically refresh the cache and reconnect to prevent connection issues
        setInterval(async () => {
            try {
                const connection = (0, uuid_1.v4)();
                await this.connect(connection);
                this.cache = await this.getTree(connection);
            }
            catch (error) {
                console.log('error', error);
            }
        }, 60000); // 60000 milliseconds (1 minute)
    }
    /**
    * List files and directories in the current FTP directory for a given connection.
    * @param {string} connection - The key identifying the FTP connection.
    * @returns {Promise<any>} A promise that resolves to the success response with file and folder information.
    */
    async ls(connection) {
        try {
            // Retrieve the list of files and directories in the current FTP directory
            const response = await this.connections[connection].list();
            // Get the current working directory (PWD) of the FTP connection
            const pwd = await this.connections[connection].pwd();
            // Initialize arrays to store file and folder information
            const files = [];
            const folders = [];
            // Process the response if it's an array
            if (Array.isArray(response)) {
                // Iterate through each file or directory in the response
                for (const file of response) {
                    try {
                        // Modified date will fall back to the current time if an error occurred during parsing
                        let fileModifiedAtDate;
                        try {
                            fileModifiedAtDate = moment_1.default.utc(file.rawModifiedAt).toISOString();
                        }
                        catch (e) {
                            console.log(`An error ocurred in ftpUtility:ls() while parsing the following date: ${file.raw}`);
                            fileModifiedAtDate = moment_1.default.utc().toISOString();
                        }
                        if (file.type === 1) {
                            // If it's a file, add it to the files array
                            files.push({
                                name: file.name,
                                path: `${pwd}/${file.name}`,
                                type: file.type === 1 ? 'file' : 'directory',
                                size: file.size,
                                date: file.rawModifiedAt && fileModifiedAtDate,
                            });
                        }
                        else {
                            // If it's a directory, add it to the folders array
                            folders.push({
                                name: file.name,
                                path: `${pwd}/${file.name}`,
                                type: file.type === 1 ? 'file' : 'directory',
                                size: file.size,
                                date: file.rawModifiedAt && fileModifiedAtDate,
                            });
                        }
                    }
                    catch (error) {
                        // Log errors while processing files or directories
                        console.error('Error processing FTP file or folder', error);
                    }
                }
            }
            // Return the combined information of files and folders as a success response
            return responseUtility_1.responseUtility.success({ files: [...folders, ...files] });
        }
        catch (error) {
            // Log errors and return an error response if the FTP action fails
            console.error('Error listing FTP directory', error);
            return responseUtility_1.responseUtility.error('ftpUtility.ls.failed_action');
        }
    }
    /**
    * Move a file or folder in the FTP server.
    * @param {string} connection - The key identifying the connection.
    * @param {string} from - The current path of the file or folder.
    * @param {string} to - The destination path.
    * @param {string} file - The name of the file or folder to move.
    * @returns {Promise<any>} A promise that resolves to the success response with the new path and the FTP server's response.
    * @memberof FtpUtility
    */
    async mov(connection, from, to, file) {
        try {
            await this.connections[connection].ensureDir(to);
            const response = await this.connections[connection].rename(`${from}`, `${to}/${file}`);
            return responseUtility_1.responseUtility.success({ path: `${to}/${file}`, response });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('ftpUtility.mov.failed_action');
        }
    }
    /**
    * Execute a command on the FTP server.
    * @param {string} connection - The key identifying the connection.
    * @param {string} command - The command to execute.
    * @returns {Promise<any>} A promise that resolves to the success response with the command and the FTP server's response.
    * @memberof FtpUtility
    */
    async cmd(connection, command) {
        try {
            const response = await this.connections[connection].send(command);
            return responseUtility_1.responseUtility.success({ command, response });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('ftpUtility.cmd.failed_action');
        }
    }
    /**
    * Change the current working directory in the FTP server.
    * @param {string} connection - The key identifying the connection.
    * @param {string} dir - The directory to change to.
    * @param {boolean} createDirectories - Whether any directories that don't exist in the path should be automatically created
    * @returns {Promise<any>} A promise that resolves to the success response with the new path and the FTP server's response.
    * @memberof FtpUtility
    */
    async cd(connection, dir, createDirectories = false) {
        try {
            let response = null;
            if (createDirectories)
                response = await this.connections[connection].ensureDir(dir);
            else
                response = await this.connections[connection].cd(dir);
            return responseUtility_1.responseUtility.success({
                path: await this.connections[connection].pwd(),
                response
            });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('ftpUtility.cd.failed_action');
        }
    }
    /**
     * Will download a file from the FTP server onto the local machine
     *
     * @param connection unique user connection UUID
     * @param localDest the path on the local machine (this node server) where the file will be downloaded to.
     * @param remotePath the path on the remote ftp server that the file is located at
     */
    async downloadTo(connection, localDest, remotePath) {
        try {
            await this.connections[connection].ensureDir(localDest);
            this.connections[connection].trackProgress((info) => {
                console.log(`File: ${info.name}. Progress: ${info.bytes} / ${info.bytesOverall}`);
            });
            const response = await this.connections[connection].downloadTo(localDest, remotePath);
            return responseUtility_1.responseUtility.success();
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('ftpUtility.downloadTo.failed_action');
        }
    }
    /**
    * Get the current working directory in the FTP server.
    * @param {string} connection - The key identifying the connection.
    * @returns {Promise<any>} A promise that resolves to the success response with the current path.
    * @memberof FtpUtility
    */
    async pwd(connection) {
        try {
            return responseUtility_1.responseUtility.success({
                path: await this.connections[connection].pwd()
            });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('ftpUtility.cd.failed_action');
        }
    }
    /**
    * Retrieves the directory tree structure from the FTP server for a given connection.
    * @param {string} connection - The key identifying the FTP connection.
    * @returns {Promise<any>} A promise that resolves to the success response with the directory tree.
    */
    async getTree(connection) {
        try {
            // Get the current working directory (PWD) of the FTP connection
            const pwd = await this.connections[connection].pwd();
            // Initialize an empty array to store the directory tree
            const tree = [];
            // List the content (files and directories) of the current FTP directory
            const content = await this.connections[connection].list();
            // Recursive function to get content inside directories
            const getContent = async (folder) => {
                if (!folder.files)
                    folder.files = [];
                // Change the current working directory of the FTP connection to the folder's path
                const response = await this.connections[connection].cd(folder.path);
                // List the content of the current FTP directory
                const content = await this.connections[connection].list();
                // Iterate through the content (files and directories)
                if (Array.isArray(content)) {
                    for (const file of content) {
                        if (file.type === 1) {
                            // If it's a file, add it to the folder's files array
                            folder.files.push({
                                name: file.name,
                                path: `${folder.path}/${file.name}`,
                                type: file.type === 1 ? 'file' : 'directory',
                                size: file.size,
                                date: file.rawModifiedAt && moment_1.default.utc(file.rawModifiedAt).toISOString(),
                            });
                        }
                        else {
                            // If it's a directory, create a sub-folder object and recursively get its content
                            const _folder = {
                                name: file.name,
                                path: `${folder.path}/${file.name}`,
                                type: file.type === 1 ? 'file' : 'directory',
                                size: file.size,
                                date: file.rawModifiedAt && moment_1.default.utc(file.rawModifiedAt).toISOString(),
                                files: [],
                            };
                            await getContent(_folder);
                            folder.files.push(_folder);
                        }
                    }
                }
            };
            // Iterate through the content (files and directories) of the current FTP directory
            if (Array.isArray(content)) {
                for (const file of content) {
                    if (file.type === 1) {
                        // If it's a file, add it to the main tree array
                        tree.push({
                            name: file.name,
                            path: `${pwd}/${file.name}`,
                            type: file.type === 1 ? 'file' : 'directory',
                            size: file.size,
                            date: file.rawModifiedAt && moment_1.default.utc(file.rawModifiedAt).toISOString(),
                        });
                    }
                    else {
                        // If it's a directory, create a folder object and recursively get its content
                        const _folder = {
                            name: file.name,
                            path: `${pwd}/${file.name}`,
                            type: file.type === 1 ? 'file' : 'directory',
                            size: file.size,
                            date: file.rawModifiedAt && moment_1.default.utc(file.rawModifiedAt).toISOString(),
                            files: [],
                        };
                        await getContent(_folder);
                        tree.push(_folder);
                    }
                }
            }
            // Disconnect from the FTP connection
            this.disconnect(connection);
            // Return the directory tree as a success response
            return responseUtility_1.responseUtility.success({
                tree,
            });
        }
        catch (error) {
            // Handle errors and log them
            console.error('Error getting FTP directory tree', error);
        }
    }
    /**
    * Get the cached directory tree structure.
    * @param {string} connection - The key identifying the connection.
    * @returns {Promise<any>} A promise that resolves to the cached directory tree.
    * @memberof FtpUtility
    */
    async getTreeCached(connection) {
        try {
            if (this.cache)
                return this.cache;
            return await this.getTree(connection);
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Get the singleton instance of FtpUtility.
    * @static
    * @memberof FtpUtility
    * @returns {FtpUtility} The FtpUtility instance.
    */
    static getInstance() {
        try {
            if (!FtpUtility.instance) {
                FtpUtility.instance = new FtpUtility();
            }
            return FtpUtility.instance;
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.FtpUtility = FtpUtility;
// Singleton instance of FtpUtility
exports.ftpUtility = FtpUtility.getInstance();
//# sourceMappingURL=ftpUtility.js.map