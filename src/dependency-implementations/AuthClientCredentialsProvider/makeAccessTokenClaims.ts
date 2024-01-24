import AccessTokenClaims from "../../core/entities/AccessTokenClaims";
import { DecodedAccessTokenClaims } from "./authClientCredentialsTypes";

export default function makeAccessTokenClaims(
    decodedAccessTokenClaims: DecodedAccessTokenClaims,
): AccessTokenClaims {
    return {
        uid: decodedAccessTokenClaims.uid,
        sub: decodedAccessTokenClaims.sub,
    };
}
