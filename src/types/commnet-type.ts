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
    id?: ObjectId,
    postid?: ObjectId | string,
    content: string,
    userId: ObjectId | string | undefined,
    userLogin: string,
    addedAt: Date
    likesInfo: LikesInfo
}
export type NewCommentType = {
    id?: ObjectId,
    _id?: ObjectId,
    postid?: ObjectId | string,
    content: string,
    userId: ObjectId | string | undefined,
    userLogin: string,
    addedAt: Date
}
export type LikesInfo = {

    likesCount: number,
    dislikesCount: number,
    myStatus: string

}
export type CommentsResponseTypeWithPagination = PaginationType<CommentResponseType>