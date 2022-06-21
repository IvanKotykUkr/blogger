import { bloggersRepositories} from "./bloggers-db-repositories";
import { postsCollection} from "./db";
import {postsService} from "../domain/posts-service";








export const postsRepositories = {
   async getPosts(){
        return postsCollection.find({}).project({_id:0}).toArray()
    },
    async getPostsPagination(number:number,size:number){
        return postsCollection.find({}).skip(number).limit(size).project({_id:0}).toArray()
    },

    async findPostsById(id:number){
        const post =  postsCollection.findOne({id:id} ,{projection:{_id:0}})
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


   },
   async findPostsByIdBlogger(bloggerId:number){
       const posts = postsCollection.find({bloggerId:bloggerId}).project({_id:0}).toArray()
       return posts
   },
   async findPostsByIdBloggerPagination(bloggerId:number,number:number,size:number) {
       const posts = postsCollection.find({bloggerId:bloggerId}).skip(number).limit(size).project({_id:0}).toArray()
       return posts

   }

}