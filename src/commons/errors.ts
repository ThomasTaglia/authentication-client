export class HandledError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class UserExistingEmailError extends HandledError {}

export class UserEmailNotValidError extends HandledError {}

export class UserNotFoundError extends HandledError {}

export class UserWrongPasswordError extends HandledError {}

export class AccessTokenNotValidError extends HandledError {}

export class AccessTokenMalformedError extends HandledError {}

export class InvalidAuthorizationHeader extends HandledError {}
