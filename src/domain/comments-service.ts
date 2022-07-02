import {commentsRepositories} from "../repositories/comments-db-repositories";
import {CommentType, PostType} from "../repositories/db";

export const commentsService = {
    async sendAllCommentsByPostId(postId: string, pagenumber: number, pagesize: number) {
        let totalCount = await commentsRepositories.commentCount(postId)
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        const items = await commentsRepositories.allCommentByPostIdPagination(postId, page, pageSize)
        let comment = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        }
        return comment
    },
    async createCommentsByPost(postid: string, content: string, userid: string, userLogin: string): Promise<CommentType> {
        let newComment: CommentType = {
            id: "" + (+(new Date())),
            postid,
            content,
            userId: userid,
            userLogin,
            addedAt: "" + (new Date())
        }
        await commentsRepositories.createComment(newComment)
        return {
            id: newComment.id,
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            addedAt: newComment.addedAt
        }
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        return await commentsRepositories.updateCommentById(id, content)


    },
    async deleteCommentsById(id: string): Promise<boolean> {
        return await commentsRepositories.deleteCommentsById(id)

    },

    async findCommentsById(id: string): Promise<CommentType | null> {
        const comment: CommentType | null = await commentsRepositories.findCommentById(id)
        return comment
    }
}