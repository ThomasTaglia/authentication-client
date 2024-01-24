import {
    HttpMethod,
    Route,
} from "@swissknife-api-components-nodejs/express-rest-interface";
import { HttpStatusCode } from "axios";

import AccessTokenDto from "../../../core/dtos/AccessTokenDto";
import LoginUserDto from "../../../core/dtos/LoginUserDto";
import LoginUser from "../../../core/usecases/LoginUser";
import getAccessTokenDto from "../schemas/getAccessTokenDto";
import generateHttpErrorResponse from "../utils/generateHttpErrorResponse";

type ReqBody = LoginUserDto;
type ResBody = AccessTokenDto;

export default (loginUser: LoginUser): Route<void, void, ReqBody, ResBody> => ({
    path: "/api/v1/login",
    method: HttpMethod.Post,
    requiresAuthentication: false,
    errorConverter: generateHttpErrorResponse,
    operationObject: {
        tags: ["users"],
        summary: "Login user.",
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: { type: "string" },
                            password: { type: "string" },
                        },
                        required: ["email", "password"],
                    },
                },
            },
            required: true,
        },
        responses: {
            [HttpStatusCode.Ok]: {
                description: "User authenticated.",
                content: {
                    "application/json": {
                        schema: getAccessTokenDto(),
                    },
                },
            },
        },
    },
    handler: async (req, res) => {
        const accessToken = await loginUser.exec(req.body);
        res.status(HttpStatusCode.Ok).send(accessToken);
    },
});
