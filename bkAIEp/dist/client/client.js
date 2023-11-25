"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required libraries and modules
const ora_1 = __importDefault(require("ora")); // Library for displaying loading spinners
const chalk_1 = __importDefault(require("chalk")); // Library for styling console output
const node_fs_1 = __importDefault(require("node:fs")); // Node.js filesystem module
const env_1 = require("../config/env"); // Configuration settings
const seederModel_1 = require("./models/seederModel"); // Sequelize model for seeders
const connection_1 = __importDefault(require("../app/database/connection")); // Sequelize database connection
const args = require('minimist')(process.argv.slice(2)); // Command line arguments parser
// Define a global environment object if not already defined
if (!global.env)
    global.env = {};
// Copy configuration settings to the global environment object
if (env_1.config) {
    for (const _k of Object.keys(env_1.config)) {
        global.env[_k] = env_1.config[_k];
    }
}
// Define the main function for the CLI
const client = async () => {
    const _console = console.log;
    // Function to decode names (convert hyphen-separated to camelCase)
    const decodeName = (name) => {
        const name_array = name.split('-');
        const name_array_camelize = name_array.map((n, i) => {
            if (i !== 0) {
                return n.charAt(0).toUpperCase() + n.slice(1);
            }
            else {
                return n;
            }
        });
        return name_array_camelize.join('');
    };
    // Function to run seeders
    const runSeeders = async (console) => {
        console.stopAndPersist({
            symbol: '🚀',
            text: `${console.paint.blue('Launching Seeders')}`,
        });
        console.log('');
        console.start();
        // Define the relative path to seeders
        const relative = '/src/seeders/';
        const path = `${process.cwd()}${relative}`;
        // Read files in the seeders directory
        const files = node_fs_1.default.readdirSync(path, { encoding: "utf-8" });
        // Iterate through seeders and run them
        if (files && files.length > 0) {
            for (const seederName of files.filter(_f => _f.includes('.ts'))) {
                const name = seederName.replace('.ts', '');
                try {
                    // Check if the seeder has been launched before
                    const exists = await seederModel_1.SeederModel.findOne({
                        where: {
                            seeder: name
                        }
                    });
                    if (exists) {
                        console.info(`Seeder ${console.paint.blue(name)} already launched`);
                        continue;
                    }
                    else {
                        // Load and run the seeder
                        const seeder = require(`${path}${seederName}`);
                        const response = await seeder.run(args, console);
                        // Update the database with the seeder's name
                        if (response) {
                            await seederModel_1.SeederModel.create({ seeder: name });
                            console.succeed(`Seeder ${console.paint.green(name)} launched`);
                        }
                        else {
                            console.fail(`Seeder ${console.paint.red(name)} failed`);
                        }
                    }
                }
                catch (error) {
                    console.warn(`Seeder ${console.paint.yellow(name)} aborted`);
                }
                console.stop();
            }
        }
    };
    {
        // Create an ora spinner instance for the CLI
        const console = (0, ora_1.default)({
            text: 'aie-cli',
        });
        // Add custom properties to the console instance
        console.log = _console;
        console.paint = chalk_1.default;
        // Display a welcome message
        console.stopAndPersist({
            symbol: '🤖',
            text: 'Welcome to aie-cli',
        });
        console.log('');
        // Check if a task or seeder is specified in the command line arguments
        if (!args.seeder && !args.task) {
            console.fail('Error: No task specified');
            console.stop();
            process.exit(0);
        }
        // Execute the specified task or seeder
        if (args.task) {
            // Run a task
            const relative = '/src/tasks/';
            const path = `${process.cwd()}${relative}`;
            const name = decodeName(args.task);
            const task = require(`${path}${name}Program`);
            task.run(args, console);
        }
        else {
            // Run a seeder or a batch of seeders
            const relative = '/src/seeders/';
            const path = `${process.cwd()}${relative}`;
            // Run a specific seeder
            if (typeof args.seeder === 'string') {
                const name = args.seeder;
                const _name = args.seeder.replace('Seeder', '');
                const exists = await seederModel_1.SeederModel.findOne({
                    where: {
                        seeder: name
                    }
                });
                if (exists && !args.f) {
                    console.info(`Seeder ${console.paint.blue(_name)} already launched`);
                    console.stop();
                    process.exit();
                }
                else {
                    console.info(`Launching seeder ${console.paint.blue(_name)}`);
                    console.text = `${console.paint.blue(_name)}`;
                    try {
                        const seeder = require(`${path}${name}`);
                        console.start();
                        const response = await seeder.run(args, console);
                        console.stop();
                        if (response) {
                            if (!args.f && !exists) {
                                await seederModel_1.SeederModel.create({ seeder: name });
                            }
                            console.succeed(`Seeder ${console.paint.green(_name)} launched`);
                        }
                        else {
                            console.fail(`Seeder ${console.paint.red(_name)} failed`);
                        }
                    }
                    catch (error) {
                        console.log('error', error);
                        console.warn(`Seeder ${console.paint.yellow(_name)} aborted`);
                    }
                }
                process.exit(0);
            }
            else if (args.x) {
                // Run all seeders
                await runSeeders(console);
                process.exit(0);
            }
            else if (args.d) {
                // Run a development seeder
                const relative = '/src/seeders/dev/';
                const path = `${process.cwd()}${relative}`;
                const name = 'initSeeder';
                const _name = name.replace('Seeder', '');
                const exists = await seederModel_1.SeederModel.findOne({
                    where: {
                        seeder: name
                    }
                });
                if (exists && !args.f) {
                    console.info(`Seeder ${console.paint.blue(_name)} already launched`);
                    console.stop();
                    process.exit();
                }
                else {
                    console.info(`Launching seeder ${console.paint.blue(_name)}`);
                    console.text = `${console.paint.blue(_name)}`;
                    try {
                        const seeder = require(`${path}${name}`);
                        console.start();
                        const response = await seeder.run(args, console);
                        console.stop();
                        if (response) {
                            if (!args.f && !exists) {
                                await seederModel_1.SeederModel.create({ seeder: name });
                            }
                            console.succeed(`Seeder ${console.paint.green(_name)} launched`);
                        }
                        else {
                            console.fail(`Seeder ${console.paint.red(_name)} failed`);
                        }
                    }
                    catch (error) {
                        console.log('error', error);
                        console.warn(`Seeder ${console.paint.yellow(_name)} aborted`);
                    }
                }
                process.exit(0);
            }
        }
    }
};
// Authenticate and sync the Sequelize database before running the client
connection_1.default.authenticate().then(async () => {
    connection_1.default.sync().then(async () => {
        await client();
    });
});
//# sourceMappingURL=client.js.map