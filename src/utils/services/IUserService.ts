// services/IUserService.ts
import { User } from "next-auth";
export interface IUserService {
    signInCredentials(username: string, password: string): Promise<User> | User;
}
