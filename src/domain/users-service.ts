import * as bcrypt from 'bcrypt';

import {userRepositories} from "../repositories/user-db-repositories";
import {ObjectId} from "mongodb";
import {UserResponseType, UserResponseTypeWithPagination, UserRoutType, UserType} from "../types/user-type";


export const usersService = {
    async convertToHex(id: string): Promise<string> {
        const hex: string = id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")

        return hex
    },
    async createUser(login: string, email: string, password: string): Promise<UserRoutType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser: UserType = {

            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date()
        }
        await userRepositories.createUser(newUser)
        return {
            id: newUser._id,
            login: newUser.login
        }
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UserType | boolean> {
        const user: UserType | null = await userRepositories.findLoginOrEmail(loginOrEmail)
        if (!user) return false

        const passwordHash = await this.generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    },
    async findUserById(userid: string): Promise<UserResponseType | null> {
        const idHex: string = await this.convertToHex(userid)
        if (idHex.length !== 48) {
            return null
        }

        const foundUser: UserResponseType | null = await userRepositories.findUserById(userid)
        return foundUser
    },
    async generateHash(password: string, salt: string): Promise<string> {
        const hash: string = await bcrypt.hash(password, salt)
        return hash
    },
    async getAllUsers(pagenumber: number, pagesize: number): Promise<UserResponseTypeWithPagination> {
        let totalCount: number = await userRepositories.countUsers()
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const items: UserRoutType[] = await userRepositories.getAllUsersPagination(pagenumber, pagesize)
        const users = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
        return users
    },
    async deleteUser(id: string): Promise<boolean> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        const isDeleted: boolean = await userRepositories.deleteUserById(id)
        return isDeleted
    }

}