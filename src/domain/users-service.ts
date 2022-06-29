import * as bcrypt from 'bcrypt';
import {UserDBtype} from "../repositories/types";
import {ObjectId} from "mongodb";
import {userRepositories} from "../repositories/user-db-repositories";



export const    usersService ={
    async createUser(login:string,email:string,password:string):Promise<{ id: string; login: string }>{
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await  this.generateHash(password,passwordSalt)

        const newUser:UserDBtype={
            _id:new ObjectId(),
            id:""+(+(new Date())),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt:new Date()
        }
        await userRepositories.createUser(newUser)
        return{
            id:newUser.id,
            login:newUser.login
        }
    },
    async checkCredentials(loginOrEmail:string, password:string){
        const user=await userRepositories.findLoginOrEmail(loginOrEmail)
        if (!user)return false

        const passwordHash = await this.generateHash(password,user.passwordSalt)

        if (user.passwordHash !==passwordHash){
            return false
        }
        return user
    },
    async findUserById(userid:string){



       const foundUser = await userRepositories.findUserById(userid)
        return foundUser
    },
    async generateHash(password:string,salt:string){
        const hash = await bcrypt.hash(password,salt)
        return hash
    },
    async getAllUsers(pagenumber:number,pagesize:number){
        let totalCount =  await userRepositories.countUsers()
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        const items= await userRepositories.getAllUsersPagination(pagenumber,pagesize)
        const users= {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items
        }
        return users
    },
    async deleteUser(id:string){
    const isDeleted= await userRepositories.deleteUserById(id)
    return isDeleted
    }

}