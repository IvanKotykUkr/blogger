
import {UserRoutType, UserType} from "../types/user-type";
import * as bcrypt from "bcrypt";
import {userRepositories} from "../repositories/user-db-repositories";

export const authService = {
    async createUser(login: string, email: string, password: string): Promise<UserRoutType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser: UserType = {
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }

        const generatedUser: UserRoutType | null = await userRepositories.createUser(newUser)
        if (generatedUser) {
            return generatedUser
        }
        return null
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserType | boolean> {
        const user: UserType | null = await userRepositories.findLoginOrEmail(loginOrEmail)

        if (!user) return false

        const passwordHash = await this.generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    },
    async generateHash(password: string, salt: string): Promise<string> {
       return  await bcrypt.hash(password, salt)

    },
}