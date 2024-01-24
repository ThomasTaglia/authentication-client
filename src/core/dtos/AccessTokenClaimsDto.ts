import AccessTokenClaims from "../entities/AccessTokenClaims";

export default interface AccessTokenClaimsDto {
    uid: string;
    sub: string;
}

export function makeAccessTokenClaimsDto(
    claims: AccessTokenClaims,
): AccessTokenClaimsDto {
    return {
        uid: claims.uid,
        sub: claims.sub,
    };
}
