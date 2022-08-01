import {ObjectId, WithId} from "mongodb";

type NewPaginationType<D> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: D[],

}
export type  PostsDBType = WithId<{
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId,
    bloggerName: string
    addedAt: Date
}>
export type PostsType = {
    id?: ObjectId | string,

    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt: Date
}
export type PostsResponseType = {
    id?: ObjectId | string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt: Date,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: Array<{
            addedAt?: Date,
            userId?: ObjectId,
            login?: string
        }>

    }
}
type NewPost = {
    id?: ObjectId | string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt: Date,
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: Array<NewestLike>
}
export type NewestLike = {
    addedAt: Date,
    userId: ObjectId,
    login: string
}
export type NewResponseType = NewPost
export type Post = {
    id?: ObjectId | string,

    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string,
    addedAt: Date
}


export type PostsResponseTypeWithPagination = NewPaginationType<PostsResponseType>;
