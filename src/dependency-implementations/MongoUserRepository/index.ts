import { Runnable } from "@swissknife-api-components-nodejs/application-runner";
import { Logger } from "@swissknife-api-components-nodejs/logger";
import { Collection, MongoClient, ObjectId } from "mongodb";

import UserRepository from "../../core/dependencies/UserRepository";
import CreateUserDocumentDto from "../../core/dtos/CreateUserDocumentDto";
import User from "../../core/entities/User";
import formatError from "../../core/utils/formatError";
import makeCreateUserDocument from "./makeCreateUserDocument";
import makeUser from "./makeUser";
import { UserDocument } from "./usersTypes";

export default class MongoUserRepository implements UserRepository, Runnable {
    private collection: Collection;
    constructor(
        private mongoClient: MongoClient,
        private logger: Logger,
    ) {
        this.collection = this.mongoClient
            .db("authenticationClient")
            .collection("users");
    }

    async start(): Promise<void> {
        await this.mongoClient.connect().catch((error: any) => {
            this.logger.error({
                type: "MONGO_USER_REPOSITORY",
                action: "CONNECT_ERROR",
                message: error.message,
                details: {
                    error: formatError(error),
                },
            });
            throw error;
        });
    }

    async stop(): Promise<void> {
        await this.mongoClient.close().catch((error: any) => {
            this.logger.error({
                type: "MONGO_USER_REPOSITORY",
                action: "DISCONNECT_ERROR",
                message: error.message,
                details: {
                    error: formatError(error),
                },
            });
            throw error;
        });
    }

    async generateId(): Promise<string> {
        try {
            return new ObjectId().toString();
        } catch (error: any) {
            this.logger.error({
                type: "MONGO_USER_REPOSITORY",
                action: "GENERATE_ID_ERROR",
                message: error.message,
                details: {
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async findOne(id: string): Promise<User | null> {
        try {
            const document = await this.collection.findOne<UserDocument>({
                _id: ObjectId.createFromHexString(id),
            });

            if (!document) {
                return null;
            }

            return makeUser(document);
        } catch (error: any) {
            this.logger.error({
                type: "MONGO_USER_REPOSITORY",
                action: "FIND_ONE_ERROR",
                message: error.message,
                details: {
                    userId: id,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const document = await this.collection.findOne<UserDocument>({
                email,
            });

            if (!document) {
                return null;
            }

            return makeUser(document);
        } catch (error: any) {
            this.logger.error({
                type: "MONGO_USER_REPOSITORY",
                action: "FIND_BY_EMAIL_ERROR",
                message: error.message,
                details: {
                    email,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async createOne(
        createUserDocumentData: CreateUserDocumentDto,
    ): Promise<void> {
        try {
            await this.collection.insertOne({
                _id: ObjectId.createFromHexString(await this.generateId()),
                ...makeCreateUserDocument(createUserDocumentData),
            });
        } catch (error: any) {
            this.logger.error({
                type: "MONGO_USER_REPOSITORY",
                action: "CREATE_ONE_ERROR",
                message: error.message,
                details: {
                    createUserDocumentData,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async deleteOne(id: string): Promise<void> {
        try {
            await this.collection.deleteOne({
                _id: ObjectId.createFromHexString(id),
            });
        } catch (error: any) {
            this.logger.error({
                type: "MONGO_USER_REPOSITORY",
                action: "DELETE_ONE_ERROR",
                message: error.message,
                details: {
                    userId: id,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }
}
