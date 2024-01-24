import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";

export default function getAccessTokenDto(): OpenAPIV3.SchemaObject {
    return {
        type: "object",
        properties: {
            accessToken: { type: "string" },
        },
        required: ["accessToken"],
        additionalProperties: false,
    };
}
