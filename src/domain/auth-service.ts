import {UserDBType, UserType} from "../types/user-type";
import * as bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {UserRepositories} from "../repositories/user-db-repositories";


import {EmailManager} from "../managers/email-manager";
import {ObjectId} from "mongodb";

const allOk = "All ok"
const wrongPassword = "wrong password"

export class AuthService {
    emailManager: EmailManager
    userRepositories: UserRepositories

    constructor() {
        this.emailManager = new EmailManager()
        this.userRepositories = new UserRepositories()
    }

    async createUser(login: string, email: string, password: string, proces: string) {
        const passwordSalt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this.generateHash(password, passwordSalt)


        const newUser: UserDBType = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
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


        const generatedUser = await this.userRepositories.createUser(newUser)
        if (proces !== "create") {
            try {
                await this.emailManager.sendEmailConfirmationMessage(newUser.accountData.email, newUser.emailConfirmation.confirmationCode)
            } catch (error) {
                console.error(error)
                if (generatedUser) {
                    //@ts-ignore
                    await this.userRepositories.deleteUserById(generatedUser._id)
                    return null;
                }

            }
        }
        if (proces === "create") {
            return {id: generatedUser._id, login: newUser.accountData.login}
        }

        if (generatedUser) {

            return allOk
        }

        return null
    }


    async checkCredentials(loginOrEmail: string, password: string): Promise<string> {
        const user: UserType | null = await this.userRepositories.findLoginOrEmail(loginOrEmail)


        const passwordHash = await this.generateHash(password, user!.accountData.passwordSalt)

        if (user!.accountData.passwordHash !== passwordHash) {
            return wrongPassword
        }
        // @ts-ignore
        return user._id
    }


    async generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)


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