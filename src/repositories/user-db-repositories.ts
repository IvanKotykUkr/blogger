import {usersCollection} from "./db";
import {InsertOneResult, ObjectId} from "mongodb";
import {UserResponseType, UserRoutType, UserType} from "../types/user-type";


export const userRepositories = {
    async countUsers(): Promise<number> {
        return usersCollection.countDocuments()
    },
    async getAllUsersPagination(pagenubmer: number, pagesize: number): Promise<UserRoutType[]> {
        // @ts-ignore
        const users: UserRoutType[] = await usersCollection.find({})
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
    async createUser(newUser: UserType): Promise<InsertOneResult<UserType>> {

        // @ts-ignore
        const user: InsertOneResult<UserType> = await usersCollection.insertOne(newUser)
        return user
    },
    async findUserById(id: string): Promise<UserResponseType | null> {
        // @ts-ignore
        let user: UserResponseType = await usersCollection.findOne({_id: new ObjectId(id)}, {
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
    async findLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {


        // @ts-ignore
        const user: UserType | null = await usersCollection.findOne({login: loginOrEmail})
        return user
    },
    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1

    }

}