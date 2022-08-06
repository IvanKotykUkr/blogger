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
export type Newest3Likes = {
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