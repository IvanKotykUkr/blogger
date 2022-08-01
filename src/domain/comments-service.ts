import {CommentsRepositories} from "../repositories/comments-db-repositories";
import {CommentResponseType, NewCommentType,} from "../types/commnet-type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {LikeDbType} from "../types/like-type";
import {LikesRepositories} from "../repositories/likes-repositories";
import {CommentHelper} from "./helpers/comment-helper";

@injectable()
export class CommentsService {


    constructor(@inject(CommentsRepositories) protected commentsRepositories: CommentsRepositories,
                @inject(LikesRepositories) protected likesRepositories: LikesRepositories,
                @inject(CommentHelper) protected commentHelper: CommentHelper
    ) {

    }


    /* async sendAllCommentsByPostId(postId: ObjectId, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination> {

         let totalCount: number = await this.commentsRepositories.commentCount(postId)

         let page: number = pagenumber
         let pageSize: number = pagesize
         let pagesCount: number = Math.ceil(totalCount / pageSize)
         const items: NewCommentType[] = await this.commentsRepositories.allCommentByPostIdPagination(postId, page, pageSize)
         let comment = {
             pagesCount,
             page,
             pageSize,
             totalCount,
             items,
         }
         return comment
     }



    async createNewComment(postid: ObjectId, content: string, userid: string, userLogin: string): Promise<NewCommentType | null> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            postid: new ObjectId(postid),
            content,
            userId: new ObjectId(userid),
            userLogin,
            addedAt: new Date()
        }
        const generatedComment: NewCommentType | null = await this.commentsRepositories.createComment(newComment)
        if (generatedComment) {
            return this.commentHelper.createResponseComment(generatedComment)
        }
        return null
    }

     */

    async updateCommentById(id: ObjectId, content: string): Promise<boolean> {

        return await this.commentsRepositories.updateCommentById(new ObjectId(id), content)


    }

    async deleteCommentsById(id: ObjectId): Promise<boolean> {
        return await this.commentsRepositories.deleteCommentsById(new ObjectId(id))

    }

    async findCommentsById(id: ObjectId): Promise<CommentResponseType | null> {

        const comment: NewCommentType | null = await this.commentsRepositories.findCommentById(new ObjectId(id))
        if (comment) {


            return this.commentHelper.createResponseComment(comment)
        }
        return null
    }


    async updateLikeStatus(likeStatus: string, postid: ObjectId, userId: ObjectId, login: string) {
        const comment: NewCommentType | null = await this.commentsRepositories.findCommentById(new ObjectId(postid))
        if (comment) {
            const like: LikeDbType = {
                _id: new ObjectId(),
                post: postid,
                status: likeStatus,
                addedAt: new Date(),
                userId,
                login

            }
            return this.likesRepositories.createLike(like)
        }
        return null


    }
}
