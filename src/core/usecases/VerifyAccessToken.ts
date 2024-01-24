import { Logger } from "@swissknife-api-components-nodejs/logger";

import { UserNotFoundError } from "../../commons/errors";
import CredentialsProvider from "../dependencies/CredentialsProvider";
import UserRepository from "../dependencies/UserRepository";
import VerifyAccessTokenDto from "../dtos/VerifyAccessTokenDto";
import logStepAndRethrow from "../utils/logStepAndRethrow";

export default class VerifyAccessToken {
    constructor(
        private userRepository: UserRepository,
        private credentialsProvider: CredentialsProvider,
        private logger: Logger,
    ) {}

    async exec(verifyAccessTokenData: VerifyAccessTokenDto): Promise<void> {
        const startExecutionTime = new Date().getTime();

        const claims = await this.credentialsProvider
            .getClaimsFromAccessToken(verifyAccessTokenData.accessToken)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_VERIFY_ACCESS_TOKEN",
                    "ACCESS_TOKEN_GET_CLAIMS_ERROR",
                ),
            );
        const user = await this.userRepository
            .findOne(claims.uid)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_VERIFY_ACCESS_TOKEN",
                    "USER_FIND_ONE_ERROR",
                ),
            );
        if (!user) {
            const message = "User not found";
            this.logger.error({
                type: "USECASE_LOGIN_USER",
                action: "USER_NOT_FOUND_ERROR",
                message: message,
                details: {
                    verifyAccessTokenData,
                },
            });
            throw new UserNotFoundError(message);
        }

        await this.credentialsProvider
            .verifyAccessToken(
                verifyAccessTokenData.accessToken,
                user.personalJwtSecret,
            )
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USECASE_VERIFY_ACCESS_TOKEN",
                    "USER_VERIFY_ACCESS_TOKEN_ERROR",
                ),
            );

        this.logger.info({
            type: "USECASE_VERIFY_ACCESS_TOKEN",
            action: "VERIFY_TOKEN_TERMINATED",
            message: "Access token verified",
            details: {
                verifyAccessTokenData,
                executionTime: new Date().getTime() - startExecutionTime,
            },
        });
    }
}
