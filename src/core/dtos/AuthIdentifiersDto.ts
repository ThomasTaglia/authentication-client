import AccessTokenClaims from "../entities/AccessTokenClaims";

export default interface AuthIdentifiersDto {
    id: string;
    subject: string;
}

export function makeAuthIdentifiersDto(
    claims: AccessTokenClaims,
): AuthIdentifiersDto {
    return {
        id: claims.uid,
        subject: claims.sub,
    };
}
