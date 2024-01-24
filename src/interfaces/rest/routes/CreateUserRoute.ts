import { HttpStatusCode } from "axios";
import {
    HttpMethod,
    Route,
} from "@swissknife-api-components-nodejs/express-rest-interface";

import CreateUserDto from "../../../core/dtos/CreateUserDto";
import CreateUser from "../../../core/usecases/CreateUser";
import generateHttpErrorResponse from "../utils/generateHttpErrorResponse";

type ReqBody = CreateUserDto;

export default (createUser: CreateUser): Route<void, void, ReqBody, void> => ({
    path: "/api/v1/subscription",
    method: HttpMethod.Post,
    requiresAuthentication: false,
    errorConverter: generateHttpErrorResponse,
    operationObject: {
        tags: ["authentication"],
        summary: "Create a new user.",
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: { type: "string" },
                            password: { type: "string" },
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                        },
                        required: [
                            "email",
                            "password",
                            "firstName",
                            "lastName",
                        ],
                    },
                },
            },
            required: true,
        },
        responses: {
            [HttpStatusCode.Created]: {
                description: "User created.",
            },
        },
    },
    handler: async (req, res) => {
        await createUser.exec(req.body);
        res.status(HttpStatusCode.Created).send();
    },
});
