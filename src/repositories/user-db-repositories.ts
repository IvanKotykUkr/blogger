import { UsersModelClass} from "./db";
import { ObjectId} from "mongodb";
import {UserResponseType, UserRoutType, UserType} from "../types/user-type";


export const userRepositories = {
    async countUsers(): Promise<number> {
        return UsersModelClass.countDocuments()
    },
    async getAllUsersPagination(pagenubmer: number, pagesize: number): Promise<UserRoutType[]> {

        const users = await UsersModelClass.find({})
            .skip(pagenubmer > 0 ? ((pagenubmer - 1) * pagesize) : 0)
            .limit(pagesize)
            .lean()

        return users.map(u => ({id: u._id, login: u.accountData.login}))
    },
    async createUser(newUser: UserType): Promise<UserType> {
        const userInstance = new UsersModelClass
        userInstance._id = new ObjectId()
        userInstance.accountData.login = newUser.accountData.login
        userInstance.accountData.email = newUser.accountData.email
        userInstance.accountData.passwordHash = newUser.accountData.passwordHash
        userInstance.accountData.passwordSalt = newUser.accountData.passwordSalt
        userInstance.accountData.createdAt = newUser.accountData.createdAt
        userInstance.emailConfirmation.confirmationCode = newUser.emailConfirmation.confirmationCode
        userInstance.emailConfirmation.expirationDate = newUser.emailConfirmation.expirationDate
        userInstance.emailConfirmation.isConfirmed = newUser.emailConfirmation.isConfirmed
        await userInstance.save()
        return {
            _id: userInstance._id,
            accountData: {
                login: userInstance.accountData.login,
                email: userInstance.accountData.email,
                passwordHash: userInstance.accountData.passwordHash,
                passwordSalt: userInstance.accountData.passwordSalt,
                createdAt: userInstance.accountData.createdAt
            },
            emailConfirmation:{
                confirmationCode:userInstance.emailConfirmation.confirmationCode,
            expirationDate:userInstance.emailConfirmation.expirationDate,
           isConfirmed:userInstance.emailConfirmation.isConfirmed,
            }

        }


    },
    async findUserById(_id: ObjectId): Promise<UserResponseType | null> {

        let user = await UsersModelClass.findOne({_id})

        if (user) {
            return {
                id: user._id,
                email: user.accountData.email,
                login: user.accountData.login,
                passwordHash: user.accountData.passwordHash,
                passwordSalt: user.accountData.passwordSalt,
                createdAt: user.accountData.createdAt
            }
        }
        return null

    },
    async findLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {


        const user = await UsersModelClass.findOne({
            $or: [
                {"accountData.login": loginOrEmail},
                {"accountData.email": loginOrEmail}
            ]
        })

        if (user) {

            return {
                _id: user._id,
                accountData: user.accountData,
                emailConfirmation: user.emailConfirmation,


            }
        }

        return null
    },
    async deleteUserById(_id: ObjectId): Promise<boolean> {
        const userInstance =await UsersModelClass.findById({_id})
        if(!userInstance)return false
        await  userInstance.deleteOne()
        return true


    },

    async findUserByCode(code: string): Promise<UserType | null> {
        const user = await UsersModelClass.findOne({"emailConfirmation.confirmationCode": code})
        if (user) {
            return {
                _id: user._id,
                accountData: user.accountData,
                emailConfirmation: user.emailConfirmation,


            }

        }
        return null
    },
    async updateConfirmation(_id: ObjectId | string | undefined): Promise<boolean> {
        const result = await UsersModelClass.updateOne({_id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1


    },

    async renewConfirmationCode(email: string, confirmationCode: string, expirationDate: Date): Promise<string> {
        const result = await UsersModelClass.findOneAndUpdate({"accountData.email": email}, {
            $set: {
                "emailConfirmation.confirmationCode": confirmationCode,
                "emailConfirmation.expirationDate": expirationDate
            }


        })
        return confirmationCode

    }
}