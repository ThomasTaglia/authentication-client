import CreateUserDocumentDto from "../dtos/CreateUserDocumentDto";
import User from "../entities/User";

export default interface UserRepository {
    generateId(): Promise<string>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    createOne(createUserDocumentData: CreateUserDocumentDto): Promise<void>;
    deleteOne(id: string): Promise<void>;
}
