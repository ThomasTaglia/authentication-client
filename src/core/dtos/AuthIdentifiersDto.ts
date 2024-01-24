import User from "../entities/User";

export default interface AuthIdentifiersDto {
    id: string;
    subject: string;
}

export function makeAuthIdentifiersDto(user: User): AuthIdentifiersDto {
    return {
        id: user.id,
        subject: user.email,
    };
}
