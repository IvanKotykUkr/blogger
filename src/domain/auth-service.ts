import {UserRoutType, UserType} from "../types/user-type";
import * as bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {userRepositories} from "../repositories/user-db-repositories";

import {emailManager} from "../managers/email-manager";
import {usersService} from "./users-service";

export const authService = {
    async createUserByAuth(login: string, email: string, password: string, ip: string): Promise<UserType | null | boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password, passwordSalt)
        const chekEmail = await userRepositories.findLoginOrEmail(email)
        const checkIp = await userRepositories.findNumberOfIp(ip)
        if (chekEmail !== null) {
            return null
        }


        const newUser: UserType = {
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            registrationData: {
                ip
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),
                    {
                        hours: 1,
                        minutes: 2

                    }),
                isConfirmed: false

            }

        }

        const generatedUser: UserType | null = await userRepositories.createUser(newUser)
        try {
            await emailManager.sendEmailConfirmationMessage(newUser)
        } catch (error) {
            console.error(error)
            // @ts-ignore
            await userRepositories.deleteUserById(generatedUser.id)
            return null;

        }
        if (generatedUser) {

            return generatedUser
        }

        return null
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserType | boolean> {
        const user: UserType | null = await userRepositories.findLoginOrEmail(loginOrEmail)

        if (!user) return false
        if (!user.emailConfirmation.isConfirmed) {
            return false
        }

        const passwordHash = await this.generateHash(password, user.accountData.passwordSalt)

        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }
        return user
    },
    async generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)

    },
    async confirmEmail(code: string) {
        let user = await userRepositories.findUserByCode(code)

        if (!user) return false

        if (user.emailConfirmation.confirmationCode !== code) {
            return false
        }

        if (user.emailConfirmation.expirationDate < new Date()) {
            return false
        }
        let result = await userRepositories.updateConfirmation(user._id)

        return result


    },
    async resentComfirmationCode(email: string, ip: string,) {
        const user = await userRepositories.findLoginOrEmail(email)

        if (!user) return false
        if (user.emailConfirmation.isConfirmed===true) {
            return false
        }
        try {
            await emailManager.resentEmailConfirmationMessage(user,)
            return true
        } catch (error) {
            console.error(error)
        }
    }
}