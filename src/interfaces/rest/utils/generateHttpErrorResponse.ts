import { HttpError } from "@swissknife-api-components-nodejs/express-rest-interface";
import { HttpStatusCode } from "axios";

import { HandledError } from "../../../commons/errors";
import { ERROR_HTTP_MAPPING } from "../errors";

export default function generateHttpErrorResponse(
    handledError: HandledError | Error,
): HttpError {
    if (!!ERROR_HTTP_MAPPING[handledError.name]) {
        return {
            code: ERROR_HTTP_MAPPING[handledError.name]!.code,
            status: ERROR_HTTP_MAPPING[handledError.name]!.status,
            message: handledError.message,
            details: {
                errorName: handledError.name,
            },
        };
    }

    return {
        code: HttpStatusCode.InternalServerError,
        status: "INTERNAL_SERVER_ERROR",
        message: handledError.message,
        details: {
            errorName: handledError.name,
        },
    };
}
