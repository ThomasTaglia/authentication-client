import { HttpError } from "@swissknife-api-components-nodejs/express-rest-interface";
import { HttpStatusCode } from "axios";

import {
    UserEmailNotValidError,
    UserExistingEmailError,
    UserNotFoundError,
    UserWrongPasswordError,
} from "../../../commons/errors";

export const ERROR_HTTP_MAPPING: Record<
    string,
    Pick<HttpError, "code" | "status">
> = {
    [UserExistingEmailError.name]: {
        code: HttpStatusCode.BadRequest,
        status: "BAD_REQUEST",
    },
    [UserEmailNotValidError.name]: {
        code: HttpStatusCode.BadRequest,
        status: "BAD_REQUEST",
    },
    [UserWrongPasswordError.name]: {
        code: HttpStatusCode.Forbidden,
        status: "FORBIDDEN",
    },
    [UserNotFoundError.name]: {
        code: HttpStatusCode.NotFound,
        status: "NOT_FOUND",
    },
} as const;
