import {commentsRepositories} from "../repositories/comments-db-repositories";
import {CommentResponseType, CommentsResponseTypeWithPagination, CommentType} from "../types/commnet-type";
import {ObjectId} from "mongodb";


export const commentsService = {
    async convertToHex(id: string): Promise<string> {
        const hex: string =
            id.split("")
                .reduce((hex, c) => hex += c
                    .charCodeAt(0)
                    .toString(16).padStart(2, "0"), "")

        return hex
    },
    async sendAllCommentsByPostId(postId: ObjectId, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination> {

        let totalCount: number = await commentsRepositories.commentCount(postId)

        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const items: CommentResponseType[] = await commentsRepositories.allCommentByPostIdPagination(postId, page, pageSize)
        let comment = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        }
        return comment
    },
    async createCommentsByPost(postid: string, content: string, userid: string, userLogin: string): Promise<CommentResponseType | null> {
        const newComment: CommentType = {
            postId: new ObjectId(postid),
            content,
            userId:new ObjectId(userid),
            userLogin,
            addedAt:  new Date()
        }
        const generatedComment: CommentResponseType | null = await commentsRepositories.createComment(newComment)
        if (generatedComment) {
            return generatedComment
        }
        return null
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {

        return await commentsRepositories.updateCommentById(new ObjectId(id), content)


    },
    async deleteCommentsById(id: string): Promise<boolean> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        return await commentsRepositories.deleteCommentsById(new ObjectId(id))

    },

    async findCommentsById(id: string): Promise<CommentResponseType | null> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return null
        }

        const comment: CommentResponseType | null = await commentsRepositories.findCommentById(new ObjectId(id))
        return comment
    },
    async deleteCommentsByPost(id: string) {
        return await commentsRepositories.deleteCommentsByPost(new ObjectId(id))
    }
}