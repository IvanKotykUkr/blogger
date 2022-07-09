import {userRepositories} from "../repositories/user-db-repositories";
import {UserResponseType, UserResponseTypeWithPagination, UserRoutType} from "../types/user-type";


export const usersService = {
    async convertToHex(id: string): Promise<string> {
        return id.split("").reduce((hex, c) => c.charCodeAt(0).toString(16).padStart(2, "0"), "")


    },

    /////
    async findUserById(userid: string): Promise<UserResponseType | null> {
        const idHex: string = await this.convertToHex(userid)
        if (idHex.length !== 48) {
            return null
        }

        return await userRepositories.findUserById(userid)

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
        return  await userRepositories.deleteUserById(id)

    }

}