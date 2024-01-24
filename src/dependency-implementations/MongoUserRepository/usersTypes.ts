export interface UserDocument {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    creationDate: string;
    isActive: boolean;
    personalJwtSecret: string;
}
