import User from "../../core/entities/User";
import { UserDocument } from "./usersTypes";

export default function makeUser(userDocument: UserDocument): User {
    return {
        id: userDocument._id,
        email: userDocument.email,
        password: userDocument.password,
        firstName: userDocument.firstName,
        lastName: userDocument.lastName,
        creationDate: userDocument.creationDate,
        isActive: userDocument.isActive,
        personalJwtSecret: userDocument.personalJwtSecret,
    };
}
