export default interface CreateUserDocumentDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    creationDate: Date;
    isActive: boolean;
    personalJwtSecret: string;
}
