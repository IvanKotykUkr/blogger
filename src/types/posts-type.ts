import {PaginationType} from "./blogger-type";
import {ObjectId, WithId} from "mongodb";
import {ExtendedLikesInfo} from "./like-type";

export type  PostsDBType = WithId<{
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
    bloggerName: string
    addedAt:Date
}>
export type PostsType = {
    id?: ObjectId | string,

    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt:Date
}
export type PostsResponseType = {
    id?: ObjectId | string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt:Date,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: [{
            addedAt?: Date,
            userId?: string,
            login?: string
        }]

    }
}
type NewPost<T>={
    id?: ObjectId | string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt:Date,
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes:T[]
}
export type newestlike={
    addedAt?: Date,
    userId?: ObjectId,
    login?: string
}
export type NewResponseType=NewPost<newestlike>
export type Post={
    id?: ObjectId | string,

    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt:Date
}


export type PostsResponseTypeWithPagination = PaginationType<NewPost<newestlike>>;
