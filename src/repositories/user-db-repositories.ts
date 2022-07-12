import {usersCollection} from "./db";
import {InsertOneResult, ObjectId} from "mongodb";
import {UserResponseType, UserRoutType, UserType} from "../types/user-type";


export const userRepositories = {
    async countUsers(): Promise<number> {
        return usersCollection.countDocuments()
    },
    async getAllUsersPagination(pagenubmer: number, pagesize: number): Promise<UserRoutType[]> {

        const users = await usersCollection.find({})
            .skip(pagenubmer > 0 ? ((pagenubmer - 1) * pagesize) : 0)
            .limit(pagesize)
            .project({
                _id: 0,
                id: "$_id",
                login: "$accountData.login",
            })
            .toArray()

        return users.map(u => ({id: u.id, login: u.login}))
    },
    async createUser(newUser: UserType): Promise<UserType | null> {
        const user = await usersCollection.insertOne(newUser)
        if (user) {

            // @ts-ignore
            return user

        }
        return null
    },
    async findUserById(id: string): Promise<UserResponseType | null> {

        let user= await usersCollection.findOne({_id: new ObjectId(id)})

        if (user) {
            return {
                id: user._id,
                login: user.accountData.login,
                passwordHash: user.accountData.passwordHash,
                passwordSalt: user.accountData.passwordSalt,
                createdAt: user.accountData.createdAt
            }
        }
        return null

    },
    async findLoginOrEmail(loginOrEmail: string):Promise<UserType|null> {


        const user = await usersCollection.findOne({
            $or: [
                {"accountData.login": loginOrEmail},
                {"accountData.email": loginOrEmail}
            ]
        })

        if (user) {
            // @ts-ignore
            return user
        }
        return null
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1

    },

    async findUserByCode(code: string) {
        const user = await usersCollection.findOne({"emailConfirmation.confirmationCode":code})
        if (user){
            return user

        }
        return null
    },
   async updateConfirmation(_id:ObjectId) {
        const result = await usersCollection.updateOne({_id},{$set:{"emailConfirmation.isConfirmed":true}})
       return result.modifiedCount===1


    },

}