import {UserRepositories} from "../repositories/user-db-repositories";
import {UserDBType, UserResponseType, UserResponseTypeWithPagination, UserRoutType} from "../types/user-type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {UserHelper} from "./helpers/user-helper";

@injectable()
export class UsersService {


    constructor(@inject(UserRepositories) protected userRepositories: UserRepositories,
                @inject(UserHelper) protected userHelper: UserHelper) {

    }

    async createUser(login: string, email: string, password: string): Promise<UserRoutType> {

        const newUser: UserDBType | null = await this.userHelper.makeUser(login, email, password)

        return {id: newUser!._id, login: newUser!.accountData.login}

    }

    async findUserById(userid: ObjectId): Promise<UserResponseType | null> {


        return this.userRepositories.findUserById(userid)

    }

    async getAllUsers(pagenumber: number, pagesize: number): Promise<UserResponseTypeWithPagination> {
        let totalCount: number = await this.userRepositories.countUsers()
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const items: UserRoutType[] = await this.userRepositories.getAllUsersPagination(pagenumber, pagesize)
        const users = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
        return users
    }

    async deleteUser(id: ObjectId): Promise<boolean> {

        return await this.userRepositories.deleteUserById(id)

    }


}
