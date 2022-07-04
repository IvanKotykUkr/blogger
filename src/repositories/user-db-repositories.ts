import {usersCollection, UserType} from "./db";
import {ObjectId} from "mongodb";


export const userRepositories = {
    async countUsers() {
        return usersCollection.countDocuments()
    },
    async getAllUsersPagination(pagenubmer: number, pagesize: number) {
        const users = await usersCollection.find({})
            .skip(pagenubmer > 0 ? ((pagenubmer - 1) * pagesize) : 0)
            .limit(pagesize)
            .project({
                _id: 0,
                id: "$_id",
                login: "$login",
            })
            .toArray()

        return users
    },
    async createUser(newUser: UserType) {
        // @ts-ignore
        await usersCollection.insertOne(newUser)
        return newUser
    },
    async findUserById(id: string): Promise<UserType | null> {
        // @ts-ignore
        let user: UserType = await usersCollection.findOne({_id: new ObjectId(id)}, {
            projection: {
                _id: 0,
                id: "$_id",
                login: "$login",
                email: "$email",
                passwordHash: "$passwordHash",
                passwordSalt: "$passwordSalt",
                createdAt: "$createdAt",
            }
        })

        if (user) {

            return user
        }
        return null

    },
    async findLoginOrEmail(loginOrEmail: string): Promise<UserType> {

        // @ts-ignore
        const user: UserType = await usersCollection.findOne({login: loginOrEmail})
        return user
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1

    }

}