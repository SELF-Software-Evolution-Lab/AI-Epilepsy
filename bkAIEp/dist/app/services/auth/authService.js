"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.authService = void 0;
const models_1 = require("../../models");
const responseUtility_1 = require("../../../core/responseUtility");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
/**
* Service for handling authentication-related operations.
* @class QueueService
*/
class AuthService {
    constructor() { }
    /**
    * Authenticates a user by validating the provided username and password.
    * @param {Object} _params - Object containing username and password for login.
    * @returns {Promise<Object>} A Promise containing the result of the login operation.
    */
    async login(_params) {
        try {
            // Find a user with the provided username
            let user = await models_1.User.findOne({
                where: {
                    username: _params.username
                }
            });
            // If user not found, return an error response
            if (!user) {
                return responseUtility_1.responseUtility.error('auth.login.error');
            }
            // Convert user to JSON for easier manipulation
            user = JSON.parse(JSON.stringify(user, null, 4));
            // Compare the provided password with the hashed password stored in the database
            const validation = await this.compare(_params.password, user.password);
            // If password validation fails, return an error response
            if (!validation) {
                return responseUtility_1.responseUtility.error('auth.login.error');
            }
            // Generate a JWT token for the authenticated user
            const token = await this.token(user);
            // Retrieve the user's role along with associated permissions
            const role = await models_1.Role.findOne({
                where: {
                    id: user.role_id
                },
                include: models_1.Permission
            });
            // Initialize user's 'can' property for permission checking
            if (!user['can'])
                user['can'] = {};
            // If a role is found, map permissions to the 'can' property
            if (role) {
                role.dataValues.Permissions.forEach(_p => {
                    if (!user['can'][_p.dataValues.module])
                        user['can'][_p.dataValues.module] = {};
                    user['can'][_p.dataValues.module][_p.dataValues.access] = true;
                });
            }
            // Remove sensitive information from the user object before returning
            delete user.password;
            // Return a success response with the authenticated user and token
            return responseUtility_1.responseUtility.success({ user, token });
        }
        catch (error) {
            console.log('error', error);
            return responseUtility_1.responseUtility.error('auth.login.fail_action');
        }
    }
    /**
    * Signs up a new user.
    * @param {Object} _params - Object containing information for user registration.
    * @returns {Promise<Object>} A Promise containing the result of the signup operation.
    */
    async signUp(_params) {
        try {
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
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Hashes the provided password using bcrypt.
    * @param {string} password - The password to be hashed.
    * @returns {Promise<string>} A Promise containing the hashed password.
    */
    async hash(password) {
        try {
            const salt = await bcryptjs_1.default.genSalt(10);
            const hash = await bcryptjs_1.default.hash(password, salt);
            return hash;
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Generates a JWT token for the provided user.
    * @param {Object} user - The user object for whom the token is generated.
    * @returns {Promise<string>} A Promise containing the generated JWT token.
    */
    async token(user) {
        try {
            return jsonwebtoken_1.default.sign({ user: user.id }, env_1.config.jwt, {
                expiresIn: '30d'
            });
        }
        catch (error) {
            console.log('error', error);
        }
    }
    /**
    * Compares a password with its hashed version.
    * @param {string} password - The password to be compared.
    * @param {string} hash - The hashed version of the password.
    * @returns {Promise<boolean>} A Promise indicating whether the password matches the hash.
    */
    async compare(password, hash) {
        try {
            return await bcryptjs_1.default.compare(password, hash);
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map