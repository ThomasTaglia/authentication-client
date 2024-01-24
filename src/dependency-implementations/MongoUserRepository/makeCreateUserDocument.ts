import CreateUserDocumentDto from "../../core/dtos/CreateUserDocumentDto";

interface CreateUserDocument {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    creationDate: Date;
    isActive: boolean;
    personalJwtSecret: string;
}

export default function makeCreateUserDocument(
    createUserDocumentData: CreateUserDocumentDto,
): CreateUserDocument {
    return {
        email: createUserDocumentData.email,
        password: createUserDocumentData.password,
        firstName: createUserDocumentData.firstName,
        lastName: createUserDocumentData.lastName,
        creationDate: createUserDocumentData.creationDate,
        isActive: createUserDocumentData.isActive,
        personalJwtSecret: createUserDocumentData.personalJwtSecret,
    };
}
