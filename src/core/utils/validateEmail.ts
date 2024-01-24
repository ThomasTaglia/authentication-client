import { Logger } from "@swissknife-api-components-nodejs/logger";

import { UserEmailNotValidError } from "../../commons/errors";

function isValidEmail(emailToBeChecked: string): boolean {
    const emailReg = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    return emailReg.test(emailToBeChecked);
}

export default async function validateEmail(
    emailToBeChecked: string,
    context: string,
    logger: Logger,
): Promise<void> {
    if (!isValidEmail(emailToBeChecked)) {
        const message = "The provided value of 'email' is not a valid email";
        logger.error({
            type: context,
            action: "USER_EMAIL_NOT_VALID_ERROR",
            message: message,
            details: {
                email: emailToBeChecked,
            },
        });
        throw new UserEmailNotValidError(message);
    }
}
