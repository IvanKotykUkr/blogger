import {UserDBType, UserType} from "../types/user-type";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {UserRepositories} from "../repositories/user-db-repositories";


import {EmailManager} from "../managers/email-manager";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {UserHelper} from "./helpers/user-helper";

const allOk = "All ok"
const wrongPassword = "wrong password"

@injectable()
export class AuthService {

    constructor(@inject(UserRepositories) protected userRepositories: UserRepositories,
                @inject(EmailManager) protected emailManager: EmailManager,
                @inject(UserHelper) protected userHelper: UserHelper) {

    }

    async createUser(login: string, email: string, password: string) {


        const newUser: UserDBType | null = await this.userHelper.makeUser(login, email, password)

        if (newUser) {
            try {
                await this.emailManager.sendEmailConfirmationMessage(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
            } catch (error) {
                console.error(error)

                await this.userRepositories.deleteUserById(new ObjectId(newUser._id))
                return null;


            }
            return newUser
        }

        return null
    }


    async checkCredentials(loginOrEmail: string, password: string): Promise<string> {
        const user: UserType | null = await this.userRepositories.findLoginOrEmail(loginOrEmail)


        const passwordHash = await this.userHelper.generateHash(password, user!.accountData.passwordSalt)

        if (user!.accountData.passwordHash !== passwordHash) {
            return wrongPassword
        }

        // @ts-ignore
        return user._id
    }


    async confirmEmail(code: string): Promise<string | boolean> {


        let user: UserType | null = await this.userRepositories.findUserByCode(code)


        let result = await this.userRepositories.updateConfirmation(user!._id)
        if (result) return allOk
        return false


    }


    async resentConfirmationCode(email: string): Promise<string | boolean> {


        const confirmationCode = uuidv4()
        const expirationDate = add(new Date(),
            {
                hours: 1,
                minutes: 2

            }
        )

        const code = await this.userRepositories.renewConfirmationCode(email, confirmationCode, expirationDate)

        try {

            await this.emailManager.resentEmailConfirmationMessage(email, code)
            return allOk
        } catch (error) {
            console.error(error)

            return true
        }


    }
}