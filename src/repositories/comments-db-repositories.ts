import {commentsCollection, CommentType} from "./db";
import {InsertOneResult, UpdateResult} from "mongodb";

export const commentsRepositories = {
    async commentCount(postId: string) {
        const result: number = await commentsCollection.countDocuments({postid: postId})
        return result
    },
    async createComment(comment: CommentType): Promise<InsertOneResult<CommentType>> {
        const result: InsertOneResult<CommentType> = await commentsCollection.insertOne(comment)
        return result
    },

    async allCommentByPostIdPagination(post: string, number: number, size: number) {
        const comments = commentsCollection.find({postid: post})
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .project({_id: 0, postid: 0})
            .toArray()
        return comments

    },
    async findCommentById(idCommnet: string): Promise<CommentType> {

        // @ts-ignore
        const comments: CommentType = await commentsCollection
            .findOne({id: idCommnet}, {projection: {_id: 0, postid: 0}})


        return comments
    },

    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set: {content: content}})

        return result.matchedCount === 1
    },
    async deleteCommentsById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}