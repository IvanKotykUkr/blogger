import {inject, injectable} from "inversify";
import {
    CommentResponseType,
    CommentsDBType,
    CommentsResponseTypeWithPagination,
    NewCommentType
} from "../../types/commnet-type";
import {ObjectId} from "mongodb";
import {LikesRepositories} from "../../repositories/likes-repositories";
import {CommentsRepositories} from "../../repositories/comments-db-repositories";
import {LikeHelper} from "./like-helper";

@injectable()
export class CommentHelper {

    constructor(@inject(LikeHelper) protected likeHelper: LikeHelper,
                @inject(CommentsRepositories) protected commentsRepositories:CommentsRepositories) {
    }
    async createComment(postid: string, content: string, userid: string, userLogin: string): Promise<NewCommentType | null> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            postid: new ObjectId(postid),
            content,
            userId: new ObjectId(userid),
            userLogin,
            addedAt: new Date()
        }
        const generatedComment: NewCommentType|null = await this.commentsRepositories.createComment(newComment)
        if (generatedComment) {
            return this.createResponseComment(generatedComment)
        }
        return null
    }
    async sendAllComments(postId: ObjectId, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination> {

        let totalCount: number = await this.commentsRepositories.commentCount(postId)

        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        const itemsFromDb = await this.commentsRepositories.allCommentByPostIdPagination(postId, page, pageSize)
        const mapItems = async ()=>{return Promise.all(itemsFromDb.map(

            async d => ({
                id: d._id,
                content: d.content,
                userId: d.userId,
                userLogin: d.userLogin,
                addedAt: d.addedAt,
                likesInfo:  {
                    likesCount:await this.likeHelper.likesCount(d._id),
                    dislikesCount:await this.likeHelper.dislikesCount(d._id),
                    myStatus:await this.likeHelper.myStatus(d._id),

                }

            })))}






        let comment = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items:await mapItems(),
        }

        // @ts-ignore
        return comment
    }
    async deleteCommentsByPost(id: string): Promise<boolean> {
        return await this.commentsRepositories.deleteCommentsByPost(new ObjectId(id))
    }
    async createResponseComment(comment: NewCommentType):Promise<CommentResponseType|null> {

        if (comment) {


            return {
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: comment.addedAt,
                likesInfo: {
                    likesCount: await this.likeHelper.likesCount(new ObjectId(comment.id)),
                    dislikesCount: await this.likeHelper.dislikesCount(new ObjectId(comment.id)),
                    myStatus:await this.likeHelper.myStatus(new ObjectId(comment.id)),
                }
            }
        }
        return null
    }


}