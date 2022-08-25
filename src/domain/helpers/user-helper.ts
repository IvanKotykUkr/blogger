import {inject, injectable} from "inversify";
import * as bcrypt from "bcrypt";
import {UserDBType} from "../../types/user-type";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {UserRepositories} from "../../repositories/user-db-repositories";
import add from "date-fns/add";

@injectable()
export class UserHelper {
    constructor(@inject(UserRepositories) protected userRepositories: UserRepositories) {
    }

    async makeUser(login: string, email: string, password: string): Promise<UserDBType | null> {
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
        await this.userRepositories.createUser(newUser)

        return newUser

    }

    async generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)


    }


}