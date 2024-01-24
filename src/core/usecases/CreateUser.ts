import { Logger } from "@swissknife-api-components-nodejs/logger";

import { UserExistingEmailError } from "../../commons/errors";
import CredentialsProvider from "../dependencies/CredentialsProvider";
import UserRepository from "../dependencies/UserRepository";
import CreateUserDocumentDto from "../dtos/CreateUserDocumentDto";
import CreateUserDto from "../dtos/CreateUserDto";
import logStepAndRethrow from "../utils/logStepAndRethrow";

export default class CreateUser {
    constructor(
        private userRepository: UserRepository,
        private credentialsProvider: CredentialsProvider,
        private logger: Logger,
    ) {}

    async exec(createUserData: CreateUserDto): Promise<void> {
        const startExecutionTime = new Date().getTime();

        const email = createUserData.email;
        await this.credentialsProvider
            .validateEmail(email)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_CREATE_USER",
                    "USER_VALIDATE_EMAIL_ERROR",
                ),
            );
        const existingUser = await this.userRepository
            .findByEmail(email)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_CREATE_USER",
                    "USER_FIND_BY_EMAIL_ERROR",
                ),
            );
        if (existingUser) {
            const message = `User with email ${email} already exists`;
            this.logger.error({
                type: "USECASE_CREATE_USER",
                action: "EXISTING_USER_EMAIL_ERROR",
                message: message,
                details: {
                    email: email,
                },
            });
            throw new UserExistingEmailError(message);
        }
        const encryptedPassword = await this.credentialsProvider
            .encryptPassword(createUserData.password)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_CREATE_USER",
                    "USER_ENCRYPT_PASSWORD_ERROR",
                ),
            );
        const jwtSecret = await this.credentialsProvider
            .generateJwtSecret()
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_CREATE_USER",
                    "USER_GENERATE_JWT_SECRET_ERROR",
                ),
            );
        const userDocumentData: CreateUserDocumentDto = {
            email: email,
            password: encryptedPassword,
            firstName: createUserData.firstName,
            lastName: createUserData.lastName,
            creationDate: new Date(),
            isActive: true,
            personalJwtSecret: jwtSecret,
        };
        await this.userRepository
            .createOne(userDocumentData)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_CREATE_USER",
                    "USER_CREATE_ONE_ERROR",
                ),
            );
        this.logger.info({
            type: "USECASE_CREATE_USER",
            action: "CREATE_USER_TERMINATED",
            message: "User created",
            details: {
                userDocumentData,
                executionTime: new Date().getTime() - startExecutionTime,
            },
        });
    }
}
