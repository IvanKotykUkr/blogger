import {commentsCollection} from "./db";
import {InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {CommentResponseType, CommentType} from "../types/commnet-type";

const projectionComment = {
    _id: 0,
    id: "$_id",
    content: "$content",
    userId: "$userId",
    userLogin: "$userLogin",
    addedAt: "$addedAt",
}
export const commentsRepositories = {
    async commentCount(postId: string): Promise<number> {
        const result: number = await commentsCollection.countDocuments({postid: new ObjectId(postId)})
        return result
    },
    async createComment(comment: CommentType): Promise<InsertOneResult<CommentType>> {

        // @ts-ignore
        const result: InsertOneResult<CommentType> = await commentsCollection.insertOne(comment)
        return result
    },

    async allCommentByPostIdPagination(post: string, number: number, size: number): Promise<CommentResponseType[]> {
        // @ts-ignore
        const comments: CommentResponseType[] = await commentsCollection.find({postid: new ObjectId(post)})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .project(projectionComment)
            .toArray()


        return comments

    },
    async findCommentById(idComment: string): Promise<CommentResponseType | null> {


        // @ts-ignore
        const comments: CommentResponseType | null = await commentsCollection
            .findOne({_id: new ObjectId(idComment)}, {
                projection: projectionComment
            })
        return comments


    },

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({_id: new ObjectId(id)},
            {$set: {content: content}})

        return result.matchedCount === 1
    },
    async deleteCommentsById(id: string): Promise<boolean> {

        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}