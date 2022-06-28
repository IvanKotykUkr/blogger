import { bloggersRepositories} from "./bloggers-db-repositories";
import { postsCollection} from "./db";
import {postsService} from "../domain/posts-service";








export const postsRepositories = {
   async getPostsCount() {
       return postsCollection.countDocuments()
   },
    async getPostsPagination(number:number,size:number){
        return postsCollection.find({}).skip( number > 0 ? ( ( number - 1 ) * size ) : 0 ).limit(size).project({_id:0}).toArray()
    },

    async findPostsById(id:string){
        const post =  postsCollection.findOne({id:id} ,{projection:{_id:0}})
        return post;
    },
    async createPost(newpost:any){

       const result = await postsCollection.insertOne(newpost)
        return newpost
    },
   async updatePost(id:string,title:string,shortDescription:string,content:string,bloggerId:string,bloggerName:string){
       const result = await  postsCollection.updateOne({id:id},{$set:{title:title,shortDescription:shortDescription,content:content,bloggerId:bloggerId,bloggerName:bloggerName}})
       return result.matchedCount === 1
    },


    async deletePost(id:string) {
        const result = await  postsCollection.deleteOne({id:id})
        return result.deletedCount === 1


   },
   async findPostsByIdBloggerCount(bloggerId:string){
       const posts = postsCollection.countDocuments({bloggerId:bloggerId})
       return posts
   },
   async findPostsByIdBloggerPagination(bloggerId:string,number:number,size:number) {
       const posts = postsCollection.find({bloggerId:bloggerId}).skip( number > 0 ? ( ( number - 1 ) * size ) : 0 ).limit(size).project({_id:0}).toArray()
       return posts

   }

}