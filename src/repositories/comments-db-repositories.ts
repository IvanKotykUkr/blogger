import {commentsCollection} from "./db";

export const commentsRepositories = {
    async commentCount(){
        return commentsCollection.countDocuments()
    },
    async createComment(comment:any){
     const result = await commentsCollection.insertOne(comment)
        return comment
    },

    async allCommentByPostIdPagination(post:string,number:number,size:number){
        const comments = commentsCollection.find({postid:post})
            .skip( number > 0 ? ( ( number - 1 ) * size ) : 0 )
            .limit(size)
            .project({_id:0,postid:0})
            .toArray()
        return comments

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