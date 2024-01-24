import {
    HttpMethod,
    Route,
} from "@swissknife-api-components-nodejs/express-rest-interface";
import { HttpStatusCode } from "axios";

import AuthIdentifiersDto from "../../../core/dtos/AuthIdentifiersDto";
import GetUserIdentifiers from "../../../core/usecases/GetUserIdentifiers";
import getAuthIdentifiersDto from "../schemas/getAuthIdentifiersDto";
import generateHttpErrorResponse from "../utils/generateHttpErrorResponse";

type ResBody = AuthIdentifiersDto;

export default (
    getUserIdentifiers: GetUserIdentifiers,
): Route<void, void, void, ResBody> => ({
    path: "/api/v1/identifiers",
    method: HttpMethod.Get,
    requiresAuthentication: false,
    errorConverter: generateHttpErrorResponse,
    operationObject: {
        tags: ["authentication"],
        summary: "Return user identifiers for the provided access token.",
        responses: {
            [HttpStatusCode.Ok]: {
                description: "User identifiers.",
                content: {
                    "application/json": {
                        schema: getAuthIdentifiersDto(),
                    },
                },
            },
        },
    },
    handler: async (req, res) => {
        const identifiers = await getUserIdentifiers.exec(
            req.header("authorization") || "",
        );
        res.status(HttpStatusCode.Ok).send(identifiers);
    },
});
