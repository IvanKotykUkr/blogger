import {inject, injectable} from "inversify";
import {
    CommentResponseType,
    CommentsDBType,
    CommentsResponseTypeWithPagination,
    NewCommentType
} from "../../types/commnet-type";
import {ObjectId} from "mongodb";
import {CommentsRepositories} from "../../repositories/comments-db-repositories";
import {LikeHelper} from "./like-helper";

@injectable()
export class CommentHelper {

    constructor(@inject(LikeHelper) protected likeHelper: LikeHelper,
                @inject(CommentsRepositories) protected commentsRepositories: CommentsRepositories) {
    }

    async createComment(postid: ObjectId, content: string, userid: ObjectId, userLogin: string): Promise<NewCommentType | null> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            postid: postid,
            content,
            userId: userid,
            userLogin,
            addedAt: new Date()
        }
        const generatedComment: NewCommentType | null = await this.commentsRepositories.createComment(newComment)
        if (generatedComment !== null) {
            return this.createResponseComment(generatedComment)
        }
        return null
    }

    async sendAllComments(postId: ObjectId, pagenumber: number, pagesize: number, userId: ObjectId): Promise<CommentsResponseTypeWithPagination> {

        let totalCount: number = await this.commentsRepositories.commentCount(postId)

        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const itemsFromDb: CommentsDBType[] = await this.commentsRepositories.allCommentByPostIdPagination(postId, page, pageSize)

        const mapItems = async () => {
            return Promise.all(itemsFromDb.map(
                async d => ({
                    id: d._id,
                    content: d.content,
                    userId: d.userId,
                    userLogin: d.userLogin,
                    addedAt: d.addedAt,
                    likesInfo: {
                        likesCount: await this.likeHelper.likesCount(d._id),
                        dislikesCount: await this.likeHelper.dislikesCount(d._id),
                        myStatus: await this.likeHelper.myStatus(userId, d._id),

                    }

                })))
        }


        let comment = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: await mapItems(),
        }

        return comment
    }

    async deleteCommentsByPost(id: ObjectId): Promise<boolean> {
        return await this.commentsRepositories.deleteCommentsByPost(id)
    }

    async createResponseComment(comment: NewCommentType, userId?: ObjectId): Promise<CommentResponseType | null> {


        return {
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt,
            likesInfo: {
                likesCount: await this.likeHelper.likesCount(new ObjectId(comment.id)),
                dislikesCount: await this.likeHelper.dislikesCount(new ObjectId(comment.id)),
                myStatus: await this.likeHelper.myStatus(new ObjectId(userId), new ObjectId(comment.id)),
            }
        }
    }


}