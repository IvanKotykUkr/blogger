import {CommentsModelClass} from "./db";
import {ObjectId} from "mongodb";
import {CommentResponseType, CommentsDBType, CommentType} from "../types/commnet-type";
import {injectable} from "inversify";
import "reflect-metadata";
@injectable()
export class CommentsRepositories {
    reqComment(comment: CommentType) {
        return {
            id: comment._id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt
        }

    }

    async commentCount(post: ObjectId): Promise<number> {
        const result: number = await CommentsModelClass.countDocuments({postid: post})
        return result
    }

    async createComment(comment: CommentsDBType): Promise<CommentResponseType | null> {
        const commentInstance = new CommentsModelClass
        commentInstance.id = comment._id
        commentInstance.postid = comment.postid
        commentInstance.content = comment.content
        commentInstance.userId = comment.userId
        commentInstance.userLogin = comment.userLogin
        commentInstance.addedAt = comment.addedAt
        await commentInstance.save()

        if (commentInstance) {
            return this.reqComment(commentInstance)
        }
        return null


    }

    async allCommentByPostIdPagination(post: ObjectId, number: number, size: number): Promise<CommentResponseType[]> {

        const comments = await CommentsModelClass.find({postid: post})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .lean()


        return comments.map(d => ({
            id: d._id,
            content: d.content,
            userId: d.userId,
            userLogin: d.userLogin,
            addedAt: d.addedAt
        }))


    }

    async findCommentById(_id: ObjectId): Promise<CommentResponseType | null> {

        const comments = await CommentsModelClass
            .findOne({_id})


        if (comments) {
            return this.reqComment(comments)
        }
        return null


    }

    async updateCommentById(_id: ObjectId, content: string): Promise<boolean> {
        const commentInstance = await CommentsModelClass.findById(_id)
        if (!commentInstance) return false

        commentInstance.content = content

        await commentInstance.save()
        return true

    }

    async deleteCommentsById(_id: ObjectId): Promise<boolean> {
        const commentInstance = await CommentsModelClass.findById(_id)
        if (!commentInstance) return false
        await commentInstance.deleteOne()
        return true


    }

    async deleteCommentsByPost(postid: ObjectId): Promise<boolean> {
        const commentInstance = await CommentsModelClass.findOne(postid)
        if (!commentInstance) return false
        await commentInstance.deleteOne()
        return true
    }

}

