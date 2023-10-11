import * as process from "process";

/**
 * Finds value of environment variable, and returns it. If it is not present, returns the defaultValue
 * Empty strings or strings with only whitespace are considered null
 * @param variableName the name of the environment variable key
 * @param defaultValue the value to be returned if environment variable is not found
 */
function getEnv(variableName: string, defaultValue: string) {
    if (!process.env[variableName]?.trim()) {
        return defaultValue
    }
    return process.env[variableName]
}

export const config = {
    mode: 'dev',
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
}