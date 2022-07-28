import {ObjectId, WithId} from "mongodb";
import {PaginationType} from "./blogger-type";

export type CommentsDBType = WithId<{
    postid?: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    addedAt: Date
}>

export type CommentType = {
    _id?: ObjectId,
    postId?: ObjectId,
    content: string,
    userId: ObjectId,
    userLogin: string,
    addedAt: Date
}

export type CommentResponseType = {
    id?: ObjectId | string,
    postid?: ObjectId | string,
    content: string,
    userId: ObjectId | string | undefined,
    userLogin: string,
    addedAt: Date
}
export type CommentsResponseTypeWithPagination = PaginationType<CommentResponseType>