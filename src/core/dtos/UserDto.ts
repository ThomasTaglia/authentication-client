import User from "../entities/User";

export default interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    creationDate: string;
    isActive: boolean;
}

export function makeUserDto(user: User): UserDto {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        creationDate: user.creationDate,
        isActive: user.isActive,
    };
}
