import {ObjectId} from "mongodb";


export class LikeDbType {
    constructor(
        public _id: ObjectId,
        public post: ObjectId,
        public status: string,
        public addedAt: Date,
        public userId: ObjectId,
        public login: string,
    ) {
    }
}

export type NewestThreeLikes = {
    addedAt?: Date,
    userId?: ObjectId,
    login?: string
}

export type ExtendedLikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: [
        {
            addedAt?: Date,
            userId?: string,
            login?: string
        }
    ]


}
export type ArrayIdType = Array<{
    _id: ObjectId
}>
export type LikeOrDislikeIdType = Array<{
    post: ObjectId
}>
export type ArrayCountIdType = Array<{
    post: ObjectId,
    count: number
}>
export type ArrayLikesType = Array<{
    post: ObjectId,
    addedAt: Date,
    userId: ObjectId,
    login: string


}>
export type StatusLikeOrDislikeType = Array<{
    post: ObjectId,
    status: string
}>

