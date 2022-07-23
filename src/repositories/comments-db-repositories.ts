import {CommentsModelClass} from "./db";
import {InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {CommentResponseType, CommentType} from "../types/commnet-type";
import {BloggerType} from "../types/blogger-type";
import {commentsService} from "../domain/comments-service";

const projectionComment = {
    _id: 0,
    id: "$_id",
    content: "$content",
    userId: "$userId",
    userLogin: "$userLogin",
    addedAt: "$addedAt",
}
export const commentsRepositories = {
    async commentCount(post: ObjectId): Promise<number> {
        const result: number = await CommentsModelClass.countDocuments({postid: post})
        return result
    },
    async createComment(comment: CommentType): Promise<CommentResponseType | null> {
        const commentInstance = new CommentsModelClass
        commentInstance.id = new ObjectId()
        commentInstance.postid = comment.postId
        commentInstance.content = comment.content
        commentInstance.userId = comment.userId
        commentInstance.userLogin = comment.userLogin
        commentInstance.addedAt = comment.addedAt
        await commentInstance.save()

        if (commentInstance) {
            return {
                id: commentInstance._id,
                content: commentInstance.content,
                userId: commentInstance.userId,
                userLogin: commentInstance.userLogin,
                addedAt: commentInstance.addedAt
            }
        }
        return null


    },

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


    },
    async findCommentById(idComment: string): Promise<CommentResponseType | null> {

        const comments = await CommentsModelClass
            .findOne({_id: new ObjectId(idComment)}
            )

        if (comments) {
            return {
                id: comments._id,
                content: comments.content,
                userId: comments.userId,
                userLogin: comments.userLogin,
                addedAt: comments.addedAt
            }
        }
        return null


    },

    async updateCommentById(_id: ObjectId, content: string): Promise<boolean> {
        const commentInstance = await CommentsModelClass.findById(_id)
        if (!commentInstance) return false

        commentInstance.content = content

        await commentInstance.save()
        return true

    },
    async deleteCommentsById(_id:ObjectId): Promise<boolean> {
        const commentInstance =await CommentsModelClass.findById(_id)
        if(!commentInstance) return false
        await commentInstance.deleteOne()
        return true


    },
    async deleteCommentsByPost(postid: ObjectId): Promise<boolean> {
        const commentInstance = await CommentsModelClass.findOne(postid)
        if(!commentInstance) return false
        await commentInstance.deleteOne()
        return true
    }
}