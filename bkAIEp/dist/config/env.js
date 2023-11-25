"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const process = __importStar(require("process"));
/**
* Finds value of environment variable, and returns it. If it is not present, returns the defaultValue
* Empty strings or strings with only whitespace are considered null
* @param variableName the name of the environment variable key
* @param defaultValue the value to be returned if environment variable is not found
*/
function getEnv(variableName, defaultValue) {
    if (!process.env[variableName]?.trim()) {
        return defaultValue;
    }
    return process.env[variableName];
}
exports.config = {
    mode: 'dev',
    jwt: getEnv("JWT_SECRET", "secret"),
    database: {
        sync: {
            force: false
        },
        host: getEnv("DB_HOST", '172.16.238.10'),
        dialect: 'mysql',
        logging: false,
        connection: {
            database: getEnv("DB_NAME", 'ai_epilepsy'),
            username: getEnv("DB_USERNAME", 'root'),
            password: getEnv("DB_PASSWORD", 'ai_epilepsy10*'),
        },
    },
    rabbit: {
        protocol: getEnv("RB_PROTOCOL", "amqp"),
        hostname: getEnv("RB_HOST", "172.16.238.13"),
        port: getEnv("RB_PORT", "5672"),
        username: getEnv("RB_USERNAME", "amqpuser"),
        password: getEnv("RB_PASSWORD", "ai_epilepsy10*"),
        vhost: "/"
    },
    ftp: {
        logger: true,
        connections: [
            {
                key: getEnv("FTP_KEY", "homi"),
                host: getEnv("FTP_HOST", "172.16.238.12"),
                user: getEnv("FTP_USERNAME", "ftpuser"),
                password: getEnv("FTP_PASSWORD", "ai_epilepsy10*"),
                port: Number(getEnv("FTP_PORT", "21")),
                secure: false
            }
        ]
    }
};
//# sourceMappingURL=env.js.map