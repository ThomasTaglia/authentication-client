import { Logger } from "@swissknife-api-components-nodejs/logger";

import {
    UserNotFoundError,
    UserWrongPasswordError,
} from "../../commons/errors";
import CredentialsProvider from "../dependencies/CredentialsProvider";
import UserRepository from "../dependencies/UserRepository";
import AccessTokenDto, { makeAccessTokenDto } from "../dtos/AccessTokenDto";
import LoginUserDto from "../dtos/LoginUserDto";
import logStepAndRethrow from "../utils/logStepAndRethrow";

export default class LoginUser {
    constructor(
        private userRepository: UserRepository,
        private credentialsProvider: CredentialsProvider,
        private logger: Logger,
    ) {}

    async exec(loginUserData: LoginUserDto): Promise<AccessTokenDto> {
        const startExecutionTime = new Date().getTime();

        const email = loginUserData.email;
        await this.credentialsProvider
            .validateEmail(email)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_LOGIN_USER",
                    "USER_VALIDATE_EMAIL_ERROR",
                ),
            );
        const existingUser = await this.userRepository
            .findByEmail(email)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_LOGIN_USER",
                    "USER_FIND_BY_EMAIL_ERROR",
                ),
            );

        if (!existingUser) {
            const message = `User with email ${email} not found`;
            this.logger.error({
                type: "USECASE_LOGIN_USER",
                action: "USER_NOT_FOUND_ERROR",
                message: message,
                details: {
                    email,
                },
            });
            throw new UserNotFoundError(message);
        }

        if (
            !(await this.credentialsProvider
                .isValidPassword(loginUserData.password, existingUser.password)
                .catch(
                    logStepAndRethrow(
                        this.logger,
                        "USECASE_LOGIN_USER",
                        "USER_IS_VALID_PASSWORD_ERROR",
                    ),
                ))
        ) {
            const message = `Wrong password for user with email ${email}`;
            this.logger.error({
                type: "USECASE_LOGIN_USER",
                action: "USER_WRONG_PASSWORD_ERROR",
                message: message,
                details: {
                    email: email,
                },
            });
            throw new UserWrongPasswordError(message);
        }

        const accessToken = await this.credentialsProvider
            .generateAccessToken(
                existingUser.id,
                existingUser.email,
                existingUser.personalJwtSecret,
            )
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_LOGIN_USER",
                    "USER_GENERATE_ACCESS_TOKEN_ERROR",
                ),
            );

        this.logger.info({
            type: "USECASE_LOGIN_USER",
            action: "LOGIN_USER_TERMINATED",
            message: "User logged in",
            details: {
                loginUserData,
                executionTime: new Date().getTime() - startExecutionTime,
            },
        });
        return makeAccessTokenDto(accessToken);
    }
}
