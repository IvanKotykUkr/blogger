import {commentsRepositories} from "../repositories/comments-db-repositories";

export const commentsService = {
    async sendAllCommentsByPostId(postId:number){
       return  await commentsRepositories.allCommentsByPostId(postId)


    },
    async createCommentsByPost(postid:number,content:string,userid:string,userLogin:string){
        let newComment={
            id: +(new Date()),
            postid,
            content,
            userid,
            userLogin,
            createdAt:new Date()
        }
        await commentsRepositories.createComment(newComment)
        return{
            id:newComment.id,
            content:newComment.content,
            userId:newComment.userid,
            userLogin:newComment.userLogin,
            addeAdt:newComment.createdAt
        }
    },
    async updateCommentById(id:number|string,content:string){
        return await commentsRepositories.updateCommentById(id,content)


    },
    async deleteCommentsById(id:number){
        return await commentsRepositories.deleteCommentsById(id)

    },
    async getCommentsById(id:string|number){
        const comment = await commentsRepositories.findCommentById(id)
        return comment

    },
}