import { Logger } from "@swissknife-api-components-nodejs/logger";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, {
    JsonWebTokenError,
    NotBeforeError,
    TokenExpiredError,
    decode,
} from "jsonwebtoken";
import { isNil } from "lodash";

import {
    AccessTokenMalformedError,
    AccessTokenNotValidError,
    InvalidAuthorizationHeader,
    UserEmailNotValidError,
} from "../../commons/errors";
import CredentialsProvider from "../../core/dependencies/CredentialsProvider";
import AccessToken from "../../core/entities/AccessToken";
import AccessTokenClaims from "../../core/entities/AccessTokenClaims";
import formatError from "../../core/utils/formatError";
import { DecodedAccessTokenClaims } from "./authClientCredentialsTypes";
import makeAccessToken from "./makeAccessToken";
import makeAccessTokenClaims from "./makeAccessTokenClaims";

export default class AuthClientCredentialsProvider
    implements CredentialsProvider
{
    constructor(private logger: Logger) {}

    async generateAccessToken(
        userId: string,
        userEmail: string,
        jwtSecret: string,
    ): Promise<AccessToken> {
        try {
            const token = jwt.sign(
                { uid: userId, sub: userEmail } as AccessTokenClaims,
                jwtSecret,
                {
                    expiresIn: "2h",
                },
            );
            return makeAccessToken(token);
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "GENERATE_ACCESS_TOKEN",
                message: error.message,
                details: {
                    userId,
                    userEmail,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async encryptPassword(plainTextPassword: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(12);
            return bcrypt.hash(plainTextPassword, salt);
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "ENCRYPT_PASSWORD",
                message: error.message,
                details: {
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async isValidPassword(
        plainTextPassword: string,
        encryptedPassword: string,
    ): Promise<boolean> {
        try {
            return bcrypt.compare(plainTextPassword, encryptedPassword);
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "IS_VALID_PASSWORD",
                message: error.message,
                details: {
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async generateJwtSecret(): Promise<string> {
        try {
            return crypto.randomBytes(256).toString("base64");
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "GENERATE_JWT_SECRET",
                message: error.message,
                details: {
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async validateEmail(emailToCheck: string): Promise<void> {
        try {
            const emailRegex = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
            if (!emailRegex.test(emailToCheck)) {
                throw new UserEmailNotValidError(
                    `The provided email '${emailToCheck}' is not a valid email`,
                );
            }
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "VALIDATE_EMAIL",
                message: error.message,
                details: {
                    email: emailToCheck,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async getClaimsFromAccessToken(
        accessToken: string,
    ): Promise<AccessTokenClaims> {
        try {
            const decodedToken = decode(
                accessToken,
            ) as DecodedAccessTokenClaims;

            if (
                isNil(decodedToken) ||
                isNil(decodedToken.sub) ||
                isNil(decodedToken.uid)
            ) {
                throw new AccessTokenMalformedError(
                    "The provided access token is not valid",
                );
            }
            return makeAccessTokenClaims(decodedToken);
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "GET_CLAIMS_FROM_ACCESS_TOKEN",
                message: error.message,
                details: {
                    accessToken,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }

    async verifyAccessToken(
        accessToken: string,
        jwtSecret: string,
    ): Promise<AccessTokenClaims> {
        try {
            const claims = jwt.verify(
                accessToken,
                jwtSecret,
            ) as DecodedAccessTokenClaims;
            return makeAccessTokenClaims(claims);
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "VERIFY_ACCESS_TOKEN",
                message: error.message,
                details: {
                    accessToken,
                    jwtSecret,
                    error: formatError(error),
                },
            });

            if (error instanceof JsonWebTokenError) {
                throw new AccessTokenMalformedError(error.message);
            }
            if (
                error instanceof NotBeforeError ||
                error instanceof TokenExpiredError
            ) {
                throw new AccessTokenNotValidError(error.message);
            }

            throw error;
        }
    }

    async extractAccessToken(authorization: string): Promise<string> {
        try {
            if (!/^Bearer /.test(authorization)) {
                throw new InvalidAuthorizationHeader(
                    "The provided authorization header is not valid",
                );
            }
            const accessToken = authorization.slice("Bearer ".length);
            if (!accessToken) {
                throw new AccessTokenMalformedError(
                    "The provided access token is not valid",
                );
            }
            return accessToken;
        } catch (error: any) {
            this.logger.error({
                type: "AUTH_CLIENT_CREDENTIALS_PROVIDER",
                action: "EXTRACT_ACCESS_TOKEN",
                message: error.message,
                details: {
                    authorization,
                    error: formatError(error),
                },
            });
            throw error;
        }
    }
}
