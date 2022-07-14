import {UserRoutType, UserType} from "../types/user-type";
import * as bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {userRepositories} from "../repositories/user-db-repositories";

import {emailManager} from "../managers/email-manager";

import {accessAttemptsService} from "./access-attempts-service";

const more = "too mach"
const usedEmail = "email is already used"
const loginExist = "login already exist"
const badly = "Som-sing wrong"
const allOk ="All ok"

export const authService = {

    async createUserByAuth(login: string, email: string, password: string, ip: string): Promise<UserType | null | boolean | string> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password, passwordSalt)
        const checkIp = await accessAttemptsService.countAttempts(ip, new Date(), "registration")

        if (checkIp == "too mach") {
            console.log("3")
            return more
        }
        const chekEmail = await userRepositories.findLoginOrEmail(email)
        if (chekEmail !== null) {

            return usedEmail
        }

        const checkLogin= await userRepositories.findLoginOrEmail(login)
        if (checkLogin!=null){

            return loginExist
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
             await emailManager.sendEmailConfirmationMessage(newUser.accountData.email,newUser.emailConfirmation.confirmationCode)
         } catch (error) {
             console.error(error)
             // @ts-ignore
             await userRepositories.deleteUserById(generatedUser.id)
             return null;

         }
        if (generatedUser) {

            return allOk
        }

        return null
    },
    async checkCredentials(loginOrEmail: string, password: string, ip: string): Promise<UserType | boolean | string> {
        const user: UserType | null = await userRepositories.findLoginOrEmail(loginOrEmail)
        const checkIp = await accessAttemptsService.countAttempts(ip, new Date(), "login")

        if (checkIp == "too mach") {
            return more
        }
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
    async confirmEmail(code: string, ip: string) {
        const checkIp = await accessAttemptsService.countAttempts(ip, new Date(), "confirmation")

        if (checkIp == "too mach") {
            return more
        }

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
        const checkIp = await accessAttemptsService.countAttempts(ip, new Date(), "resent")

        if (checkIp == "too mach") {
            return more
        }
        const user = await userRepositories.findLoginOrEmail(email)

        if (!user) return false
        if (user.emailConfirmation.isConfirmed === true) {
            return false
        }

        const confirmationCode = uuidv4()
        const expirationDate = add(new Date(),
            {
                hours: 1,
                minutes: 2

            }
        )

        const code = await userRepositories.renewConfirmationCode(user.emailConfirmation.confirmationCode, confirmationCode, expirationDate)

        try {

            await emailManager.resentEmailConfirmationMessage(user.accountData.email, code)
            return true
        } catch (error) {
            console.error(error)

            return true
        }
    }
}