import { Logger } from "@swissknife-api-components-nodejs/logger";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { UserEmailNotValidError } from "../../commons/errors";
import CredentialsProvider from "../../core/dependencies/CredentialsProvider";
import AuthTokenClaimsDto from "../../core/dtos/AuthTokenClaimsDto";
import AccessToken from "../../core/entities/AccessToken";
import formatError from "../../core/utils/formatError";
import makeAccessToken from "./makeAccessToken";

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
                { uid: userId, sub: userEmail } as AuthTokenClaimsDto,
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
}
