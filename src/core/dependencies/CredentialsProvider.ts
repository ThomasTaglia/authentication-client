import AccessToken from "../entities/AccessToken";
import AccessTokenClaims from "../entities/AccessTokenClaims";

export default interface CredentialsProvider {
    generateAccessToken(
        userId: string,
        userEmail: string,
        jwtSecret: string,
    ): Promise<AccessToken>;
    generateJwtSecret(): Promise<string>;
    encryptPassword(plainTextPassword: string): Promise<string>;
    isValidPassword(
        plainTextPassword: string,
        encryptedPassword: string,
    ): Promise<boolean>;
    validateEmail(emailToCheck: string): Promise<void>;
    getClaimsFromAccessToken(accessToken: string): Promise<AccessTokenClaims>;
    verifyAccessToken(
        accessToken: string,
        jwtSecret: string,
    ): Promise<AccessTokenClaims>;
    extractAccessToken(authorization: string): Promise<string>;
}
