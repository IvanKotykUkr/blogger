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
                login: "$login",
            })
            .toArray()

        return users.map(u => ({id: u.id, login: u.login}))
    },
    async createUser(newUser: UserType): Promise<UserRoutType | null> {
        const user = await usersCollection.insertOne(newUser)
        if (user) {
            return {
                id: newUser._id,
                login: newUser.login
            }
        }
        return null
    },
    async findUserById(id: string): Promise<UserResponseType | null> {

        let user = await usersCollection.findOne({_id: new ObjectId(id)}, {
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
            return {
                id: user.id,
                login: user.login,
                passwordHash: user.passwordHash,
                passwordSalt: user.passwordSalt,
                createdAt: user.createdAt
            }
        }
        return null

    },
    async findLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {


        const user = await usersCollection.findOne({
            $or: [
                {"login": loginOrEmail},
                {"email": loginOrEmail}
            ]
        })

        if (user) {
            return {
                _id: user._id,
                login: user.login,
                passwordHash: user.passwordHash,
                passwordSalt: user.passwordSalt,
                createdAt: user.createdAt
            }
        }
        return null
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1

    }

}