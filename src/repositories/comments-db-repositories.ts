import {commentsCollection} from "./db";

export const commentsRepositories = {
    async createComment(comment:any){
     const result = await commentsCollection.insertOne(comment)
        return comment
    },
    async allCommentsByPostId(postId:string){
        const commets= await commentsCollection.find({postid:postId}).toArray()

            return commets


    },
    async findCommentById(Request:string){

        const comments = await commentsCollection.findOne({id:Request} )

       return comments
    },
    async updateCommentById(id:string,content:string){
        const result = await commentsCollection.updateOne({id:id},{$set:{content:content}})

        return result.matchedCount === 1
    },
    async deleteCommentsById(id:string){
        const  result= await commentsCollection.deleteOne({id:id})
        return result.deletedCount===1
    }
}