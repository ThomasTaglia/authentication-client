import { LogLevel } from "@swissknife-api-components-nodejs/logger";
import { bool, cleanEnv, num, port, str } from "envalid";
import { compact, trim } from "lodash";

import pkg from "../../package.json";

const env = cleanEnv(process.env, {
    APP_COMMIT: str({ default: new Date().getTime().toString() }),
    PUBLIC_URL: str({ default: "http://localhost:3000" }),
    PORT: port({ default: 80 }),
    LOG_LEVEL: str({ default: "INFO" }),
    MAX_JSON_REQUEST_BODY_SIZE: str({ default: "100mb" }),
    VALIDATE_API_RESPONSES: bool({ default: false }),
    MONGO_REPOSITORY_URL: str(),
    MONGO_CONNECTION_TIMEOUT: num({ default: 30000 }),
    CORS_ALLOWED_ORIGINS: str({ default: "*" }),
});

export default {
    // General
    appName: pkg.name,
    appVersion: pkg.version,
    appCommit: env.APP_COMMIT,
    userAgent: `${pkg.name}@${pkg.version}`,
    publicUrl: env.PUBLIC_URL,
    port: env.PORT,

    // Logging
    logLevel: env.LOG_LEVEL as LogLevel,

    // API
    validateApiResponses: env.VALIDATE_API_RESPONSES,
    maxJsonRequestBodySize: env.MAX_JSON_REQUEST_BODY_SIZE,

    // Security
    corsAllowedOrigins: compact(env.CORS_ALLOWED_ORIGINS.split(",").map(trim)),

    // Mongo user repository
    mongoRepository: {
        url: env.MONGO_REPOSITORY_URL,
        connectionTimeout: env.MONGO_CONNECTION_TIMEOUT,
    },
};
