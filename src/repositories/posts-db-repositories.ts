import { bloggersRepositories} from "./bloggers-db-repositories";
import { postsCollection} from "./db";
import {postsService} from "../domain/posts-service";








export const postsRepositories = {
   async getPosts(){
        return postsCollection.find({}).toArray()
    },
    async findPostsById(id:number){
        const post =  postsCollection.findOne({id:id})
        return post;
    },
    async createPost(newpost:any){

       const result = await postsCollection.insertOne(newpost)
        return newpost
    },
   async updatePost(id:number,title:string,shortDescription:string,content:string,bloggerId:number,bloggerName:string){
       const result = await  postsCollection.updateOne({id:id},{$set:{title:title,shortDescription:shortDescription,content:content,bloggerId:bloggerId,bloggerName:bloggerName}})
       return result.matchedCount === 1
    },


    async deletePost(id:number) {
        const result = await  postsCollection.deleteOne({id:id})
        return result.deletedCount === 1


   }

}