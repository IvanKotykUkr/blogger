import {UserRepositories} from "../repositories/user-db-repositories";
import {UserResponseType, UserResponseTypeWithPagination, UserRoutType} from "../types/user-type";
import {ObjectId} from "mongodb";

export class UsersService {



    constructor(protected userRepositories: UserRepositories) {

    }


    async findUserById(userid: string): Promise<UserResponseType | null> {


        return await this.userRepositories.findUserById(new ObjectId(userid))

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

    async deleteUser(id: string): Promise<boolean> {

        return await this.userRepositories.deleteUserById(new ObjectId(id))

    }

    /*async createUserByUser(login: string, email: string, password: string, ip: string): Promise<UserRoutType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.authService.generateHash(password, passwordSalt)

        const newUser: UserDBType = {
            _id: new ObjectId(),
            accountData: {
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),
                    {
                        hours: 1,
                        minutes: 2

                    }),
                isConfirmed: false

            }

        }
        const generatedUser = await this.userRepositories.createUser(newUser)

        if (generatedUser) {

            return {id: generatedUser._id, login: newUser.accountData.login}
        }

        return null

    }

     */
}
