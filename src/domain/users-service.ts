import * as bcrypt from 'bcrypt';

import {userRepositories} from "../repositories/user-db-repositories";
import {UserType} from "../repositories/db";
import {ObjectId} from "mongodb";


export const usersService = {
    async convertToHex(id: string) {
        const hex = id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")

        return hex
    },
    async createUser(login: string, email: string, password: string): Promise<{ id: ObjectId | string | undefined; login: string }> {
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
    async checkCredentials(loginOrEmail: string, password: string) {
        const user: UserType = await userRepositories.findLoginOrEmail(loginOrEmail)
        if (!user) return false

        const passwordHash = await this.generateHash(password, user.passwordSalt)

        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    },
    async findUserById(userid: string) {
        const idHex = await this.convertToHex(userid)
        if (idHex.length !== 48) {
            return null
        }

        const foundUser: UserType | null = await userRepositories.findUserById(userid)
        return foundUser
    },
    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async getAllUsers(pagenumber: number, pagesize: number) {
        let totalCount = await userRepositories.countUsers()
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        const items = await userRepositories.getAllUsersPagination(pagenumber, pagesize)
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
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        const isDeleted: boolean = await userRepositories.deleteUserById(id)
        return isDeleted
    }

}