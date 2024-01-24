import { Logger } from "@swissknife-api-components-nodejs/logger";

import { UserNotFoundError } from "../../commons/errors";
import CredentialsProvider from "../dependencies/CredentialsProvider";
import UserRepository from "../dependencies/UserRepository";
import AuthIdentifiersDto, {
    makeAuthIdentifiersDto,
} from "../dtos/AuthIdentifiersDto";
import logStepAndRethrow from "../utils/logStepAndRethrow";

export default class GetUserIdentifiers {
    constructor(
        private userRepository: UserRepository,
        private credentialsProvider: CredentialsProvider,
        private logger: Logger,
    ) {}

    async exec(authorization: string): Promise<AuthIdentifiersDto> {
        const startExecutionTime = new Date().getTime();

        const accessToken =
            await this.credentialsProvider.extractAccessToken(authorization);
        const claims = await this.credentialsProvider
            .getClaimsFromAccessToken(accessToken)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USACASE_GET_USER_IDENTIFIERS",
                    "ACCESS_TOKEN_GET_CLAIMS_ERROR",
                ),
            );
        const user = await this.userRepository
            .findOne(claims.uid)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USACASE_GET_USER_IDENTIFIERS",
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
                    userId: claims.uid,
                    userEmail: claims.sub,
                },
            });
            throw new UserNotFoundError(message);
        }

        const verifiedClaims = await this.credentialsProvider
            .verifyAccessToken(accessToken, user.personalJwtSecret)
            .catch(
                logStepAndRethrow(
                    this.logger,
                    "USACASE_GET_USER_IDENTIFIERS",
                    "USER_VERIFY_ACCESS_TOKEN_ERROR",
                ),
            );

        const identifiers = makeAuthIdentifiersDto(verifiedClaims);

        this.logger.info({
            type: "USACASE_GET_USER_IDENTIFIERS",
            action: "VERIFY_TOKEN_TERMINATED",
            message: "Access token verified",
            details: {
                authorization,
                executionTime: new Date().getTime() - startExecutionTime,
            },
        });
        return identifiers;
    }
}
