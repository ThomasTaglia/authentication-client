import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";

export default function getAuthIdentifiersDto(): OpenAPIV3.SchemaObject {
    return {
        type: "object",
        properties: {
            id: { type: "string" },
            subject: { type: "string" },
        },
        required: ["id", "subject"],
        additionalProperties: false,
    };
}
