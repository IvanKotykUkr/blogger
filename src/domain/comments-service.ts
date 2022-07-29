import {CommentsRepositories} from "../repositories/comments-db-repositories";
import {CommentResponseType, CommentsDBType, CommentsResponseTypeWithPagination,} from "../types/commnet-type";
import {ObjectId} from "mongodb";

export class CommentsService {


    constructor(protected commentsRepositories: CommentsRepositories) {

    }


    async sendAllCommentsByPostId(postId: ObjectId, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination> {

        let totalCount: number = await this.commentsRepositories.commentCount(postId)

        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const items: CommentResponseType[] = await this.commentsRepositories.allCommentByPostIdPagination(postId, page, pageSize)
        let comment = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,
        }
        return comment
    }

    async createCommentsByPost(postid: string, content: string, userid: string, userLogin: string): Promise<CommentResponseType | null> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            postid: new ObjectId(postid),
            content,
            userId: new ObjectId(userid),
            userLogin,
            addedAt: new Date()
        }
        const generatedComment: CommentResponseType | null = await this.commentsRepositories.createComment(newComment)
        if (generatedComment) {
            return generatedComment
        }
        return null
    }

    async updateCommentById(id: string, content: string): Promise<boolean> {

        return await this.commentsRepositories.updateCommentById(new ObjectId(id), content)


    }

    async deleteCommentsById(id: string): Promise<boolean> {
        return await this.commentsRepositories.deleteCommentsById(new ObjectId(id))

    }

    async findCommentsById(id: string): Promise<CommentResponseType | null> {

        const comment: CommentResponseType | null = await this.commentsRepositories.findCommentById(new ObjectId(id))
        return comment
    }

    async deleteCommentsByPost(id: string): Promise<boolean> {
        return await this.commentsRepositories.deleteCommentsByPost(new ObjectId(id))
    }

}
