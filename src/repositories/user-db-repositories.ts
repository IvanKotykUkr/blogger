import {usersCollection, UserType} from "./db";


export const userRepositories = {
    async countUsers() {
        return usersCollection.countDocuments()
    },
    async getAllUsersPagination(pagenubmer: number, pagesize: number) {
        const users = await usersCollection.find({})
            .skip(pagenubmer > 0 ? ((pagenubmer - 1) * pagesize) : 0)
            .limit(pagesize).project({_id: 0, email: 0, passwordHash: 0, passwordSalt: 0, createdAt: 0})
            .toArray()

        return users
    },
    async createUser(newUser: UserType) {
        await usersCollection.insertOne(newUser)
        return newUser
    },
    async findUserById(id: string): Promise<UserType | null> {
        // @ts-ignore
        let user: UserType = await usersCollection.findOne({id: id})

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
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1

    }

}