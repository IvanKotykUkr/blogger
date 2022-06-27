import {usersCollection} from "./db";
import {UserDBtype} from "./types";
import {ObjectId, WithId} from "mongodb";

export const userRepositories={
    async getAllUsers(){
        const users= await usersCollection.find({}).toArray()

        return users
    },
    async createUser(newUser:UserDBtype){
        await usersCollection.insertOne(newUser)
        return newUser
    },
    async findUserById(id:any){

      let user = await usersCollection.findOne({id:id})

      if(user){

          return user
      }else {
          return null
      }
    },
    async findLoginOrEmail(loginOrEmail:string){
        const user = await usersCollection.findOne({userName:loginOrEmail})
        return user
    },
    async deleteUserById(id:number){
        const result = await usersCollection.deleteOne({id:id})
        return result.deletedCount === 1

    }

}