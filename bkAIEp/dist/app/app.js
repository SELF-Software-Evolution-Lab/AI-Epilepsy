"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
// Import required modules and dependencies
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("../config/env");
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = __importDefault(require("chalk"));
// Import the 'Routes' class from the '@app/routes' module
const routes_1 = require("./routes");
// Import the 'request' middleware from the '@app/middleware/requestMiddleware' module
const requestMiddleware_1 = require("./middleware/requestMiddleware");
// Import the Sequelize database connection from the '@app/database/connection' module
const connection_1 = __importDefault(require("./database/connection"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.routes = new routes_1.Routes(this.app);
        this.dataBase = connection_1.default;
    }
    /**
    * Initializes the application.
    * @returns {Promise<void>} A Promise that resolves when the initialization is complete.
    */
    async init() {
        // Ensure global.env is initialized
        if (!global.env)
            global.env = {};
        // Copy environment variables to global.env
        if (env_1.config) {
            for (const _k of Object.keys(env_1.config)) {
                global.env[_k] = env_1.config[_k];
            }
        }
        // Freeze the global.env object to prevent further modifications
        Object.freeze(global.env);
        try {
            // Delayed initialization using setTimeout to allow time for other processes
            setTimeout(async () => {
                try {
                    // Authenticate with the database
                    await this.dataBase.authenticate();
                    // Sync the database, optionally forcing synchronization if specified in the environment
                    await this.dataBase.sync(global.env.database?.sync?.force ? { force: true } : {});
                    console.log(chalk_1.default.blue('MYSQL connected'));
                }
                catch (error) {
                    // Handle database authentication and synchronization errors
                    console.log('error', error);
                }
            }, global.env.mode === 'dev' ? 100 : 3000);
        }
        catch (error) {
            // Handle general initialization errors
            console.log('error', error);
        }
        // Enable morgan logging middleware in 'dev' mode
        if (global.env.mode === 'dev') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        // Enable middleware for parsing JSON requests
        this.app.use(express_1.default.json());
        // Enable CORS middleware
        this.app.use((0, cors_1.default)());
        // Enable custom request middleware
        this.app.use((0, requestMiddleware_1.request)());
        // Define a simple route to indicate that the API is running
        this.app.get('/', (req, res) => {
            res.send('API is running');
        });
        // Initialize application routes
        this.routes.init();
        // Set /temp/mri as the static directory for serving MRI files
        this.app.use('/temp/mri', express_1.default.static('temp/mri'));
        // Obtain the port number from the environment or use a default value (5001)
        const PORT = global.env.PORT || 8089;
        // Start the server and log the port number
        this.app.listen(PORT, console.log(chalk_1.default.blue(`Server running on port ${PORT}`)));
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map