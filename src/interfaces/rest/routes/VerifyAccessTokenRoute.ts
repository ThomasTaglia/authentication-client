import {
    HttpMethod,
    Route,
} from "@swissknife-api-components-nodejs/express-rest-interface";
import { HttpStatusCode } from "axios";

import VerifyAccessTokenDto from "../../../core/dtos/VerifyAccessTokenDto";
import VerifyAccessToken from "../../../core/usecases/VerifyAccessToken";
import generateHttpErrorResponse from "../utils/generateHttpErrorResponse";

type ReqBody = VerifyAccessTokenDto;

export default (
    verifyAccessToken: VerifyAccessToken,
): Route<void, void, ReqBody, void> => ({
    path: "/api/v1/verify",
    method: HttpMethod.Post,
    requiresAuthentication: false,
    errorConverter: generateHttpErrorResponse,
    operationObject: {
        tags: ["authentication"],
        summary:
            "Verify the provided access token. Return status 200 or error.",
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            accessToken: { type: "string" },
                        },
                        required: ["accessToken"],
                    },
                },
            },
            required: true,
        },
        responses: {
            [HttpStatusCode.Ok]: {
                description: "Valid access token.",
            },
        },
    },
    handler: async (req, res) => {
        await verifyAccessToken.exec(req.body);
        res.status(HttpStatusCode.Ok).send();
    },
});
