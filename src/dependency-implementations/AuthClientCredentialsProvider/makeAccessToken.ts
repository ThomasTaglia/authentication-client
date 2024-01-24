import AccessToken from "../../core/entities/AccessToken";

export default function makeAccessToken(accessToken: string): AccessToken {
    return {
        accessToken: accessToken,
    };
}
