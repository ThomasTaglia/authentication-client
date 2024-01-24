import AccessToken from "../entities/AccessToken";

export default interface AccessTokenDto {
    accessToken: string;
}

export function makeAccessTokenDto(accessTokenObj: AccessToken) {
    return {
        accessToken: accessTokenObj.accessToken,
    };
}
