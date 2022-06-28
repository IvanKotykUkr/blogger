import {usersCollection} from "./db";
import {UserDBtype} from "./types";
import {ObjectId, WithId} from "mongodb";

export const    userRepositories={
    async countUsers(){
        return usersCollection.countDocuments()
    },
    async getAllUsersPagination(pagenubmer:number,pagesize:number){
        const users= await usersCollection.find({})
            .skip( pagenubmer > 0 ? ( ( pagenubmer - 1 ) * pagesize ) : 0 )
            .limit(pagesize).project({_id:0,email:0,passwordHash:0,passwordSalt:0,createdAt:0})
            .toArray()

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
    async deleteUserById(id:string){
        const result = await usersCollection.deleteOne({id:id})
        return result.deletedCount === 1

    }

}