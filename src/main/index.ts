import { ApplicationRunner } from "@swissknife-api-components-nodejs/application-runner";
import { Logger } from "@swissknife-api-components-nodejs/logger";
import { SwissknifeRequestService } from "@swissknife-api-components-nodejs/requests";
import { MongoClient } from "mongodb";

import CreateUser from "../core/usecases/CreateUser";
import GetUserIdentifiers from "../core/usecases/GetUserIdentifiers";
import LoginUser from "../core/usecases/LoginUser";
import VerifyAccessToken from "../core/usecases/VerifyAccessToken";
import AuthClientCredentialsProvider from "../dependency-implementations/AuthClientCredentialsProvider";
import MongoUserRepository from "../dependency-implementations/MongoUserRepository";
import getExpressRestInterface from "../interfaces/rest";
import config from "./config";

// Common services
const requestService = new SwissknifeRequestService();
const logger = new Logger(
    requestService,
    { app_name: config.appName, app_version: config.appVersion },
    config.logLevel,
);
const mongoClient = new MongoClient(config.mongoRepository.url, {
    connectTimeoutMS: config.mongoRepository.connectionTimeout,
});

// Dependency implementations
const mongoUserRepository = new MongoUserRepository(mongoClient, logger);
const authClientCredentialsProvider = new AuthClientCredentialsProvider(logger);

// Usecases
const createUser = new CreateUser(
    mongoUserRepository,
    authClientCredentialsProvider,
    logger,
);
const loginUser = new LoginUser(
    mongoUserRepository,
    authClientCredentialsProvider,
    logger,
);
const verifyAccessToken = new VerifyAccessToken(
    mongoUserRepository,
    authClientCredentialsProvider,
    logger,
);
const getUserIdentifiers = new GetUserIdentifiers(
    mongoUserRepository,
    authClientCredentialsProvider,
    logger,
);

// Express rest interface
const expressRestInterface = getExpressRestInterface(
    requestService,
    logger,
    {
        port: config.port,
        serviceInfo: {
            name: config.appName,
            version: config.appVersion,
            commit: config.appCommit,
            publicUrl: config.publicUrl,
        },
        corsAllowedOrigins: config.corsAllowedOrigins,
        validateResponses: config.validateApiResponses,
        maxJsonRequestBodySize: config.maxJsonRequestBodySize,
    },
    {
        createUser,
        loginUser,
        verifyAccessToken,
        getUserIdentifiers,
    },
);

// Run the application
new ApplicationRunner(logger, [
    expressRestInterface,
    mongoUserRepository,
]).run();
