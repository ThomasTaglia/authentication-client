import AccessToken from "../entities/AccessToken";

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
}
