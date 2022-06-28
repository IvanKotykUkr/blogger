import * as bcrypt from 'bcrypt';
import {UserDBtype} from "../repositories/types";
import {ObjectId} from "mongodb";
import {userRepositories} from "../repositories/user-db-repositories";


export const    usersService ={
    async createUser(login:string,email:string,password:string):Promise<{ id: any; login: string }>{
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await  this.generateHash(password,passwordSalt)
        const id = +(new Date())
        const newUser:UserDBtype={
            _id:new ObjectId(),
            id:""+id,
            userName:login,
            email,
            passwordHash,
            passwordSalt,
            createdAt:new Date()
        }
        await userRepositories.createUser(newUser)
        return{
            id:newUser.id,
            login:newUser.userName
        }
    },
    async chekCredentials(loginorEmail:string,password:string){
        const user=await userRepositories.findLoginOrEmail(loginorEmail)
        if (!user)return false

        const passwordHash = await this.generateHash(password,user.passwordSalt)

        if (user.passwordHash !==passwordHash){
            return false
        }
        return user
    },
    async findUserById(userid:any){



       const foundUser = await userRepositories.findUserById(userid)
        return foundUser
    },
    async generateHash(password:string,salt:string){
        const hash = await bcrypt.hash(password,salt)
        return hash
    },
    async getAllUsers(){
       const users= await userRepositories.getAllUsers()
        return users
    },
    async deleteUser(id:string){
    const isDeleted= await userRepositories.deleteUserById(id)
    return isDeleted
    }

}