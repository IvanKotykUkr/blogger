import {commentsCollection, CommentType} from "./db";
import {InsertOneResult, ObjectId, UpdateResult} from "mongodb";

export const commentsRepositories = {
    async commentCount(postId: string) {
        const result: number = await commentsCollection.countDocuments({postid: new ObjectId(postId)})
        return result
    },
    async createComment(comment: CommentType): Promise<InsertOneResult<CommentType>> {
        // @ts-ignore
        const result: InsertOneResult<CommentType> = await commentsCollection.insertOne(comment)
        return result
    },

    async allCommentByPostIdPagination(post: string, number: number, size: number) {
        const comments = await commentsCollection.find({postid: new ObjectId(post)})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .project({
                _id: 0,
                id: "$_id",
                content: "$content",
                userId: "$userId",
                userLogin: "$userLogin",
                addedAt: "$addedAt",
            })
            .toArray()
        return comments

    },
    async findCommentById(idComment: string): Promise<CommentType | null> {

        // @ts-ignore
        const comments: CommentType = await commentsCollection
            .findOne({_id: new ObjectId(idComment)}, {
                projection: {
                    _id: 0,
                    id: "$_id",
                    content: "$content",
                    userId: "$userId",
                    userLogin: "$userLogin",
                    addedAt: "$addedAt",
                }
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