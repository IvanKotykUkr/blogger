import {commentsRepositories} from "../repositories/comments-db-repositories";

export const commentsService = {
    async sendAllCommentsByPostId(postId:string,pagenumber:number,pagesize:number){
        let totalCount =  await commentsRepositories.commentCount()
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        const items = await commentsRepositories.allCommentByPostIdPagination(postId,page, pageSize)
        let comment= {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }
        return comment





    },
    async createCommentsByPost(postid:string,content:string,userid:string,userLogin:string){
        const id=  +(new Date())
        let newComment={
            id:""+id,
            postid,
            content,
            userid:""+userid,
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
    async updateCommentById(id:string,content:string){
        return await commentsRepositories.updateCommentById(id,content)


    },
    async deleteCommentsById(id:string){
        return await commentsRepositories.deleteCommentsById(id)

    },
    async getCommentsById(id:string){
        const comment = await commentsRepositories.findCommentById(id)
        return comment

    },
}