import {PaginationType} from "./blogger-type";
import {ObjectId, WithId} from "mongodb";

export type  PostsDBType = WithId<{
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
    bloggerName: string
}>
export type PostsType = {

    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
    bloggerName: string
}
export type PostsResponseType = {
    id?: ObjectId | string,

    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string
}
export type PostsResponseTypeWithPagination = PaginationType<PostsResponseType>;
