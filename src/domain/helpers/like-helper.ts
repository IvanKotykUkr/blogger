import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {NewestLike} from "../../types/posts-type";
import {LikesRepositories} from "../../repositories/likes-repositories";
import {LikeDbType} from "../../types/like-type";

@injectable()
export class LikeHelper {
    constructor(@inject(LikesRepositories) protected likesRepositories: LikesRepositories) {
    }


    async likesCount(id: ObjectId): Promise<number> {

        return this.likesRepositories.countLike(id)
    }

    async dislikesCount(id: ObjectId): Promise<number> {

        return this.likesRepositories.countDislake(id)
    }

    async myStatus(id: ObjectId, post: ObjectId): Promise<string> {


        return this.likesRepositories.myStatus(id, post)
    }

    async newestLikes(id: ObjectId): Promise<NewestLike[]> {


        return this.likesRepositories.newstLike(id)
    }

    async createLike(likeStatus: string, postid: ObjectId, userId: ObjectId, login: string) {

        const alreadyLiked: LikeDbType | boolean = await this.likesRepositories.findLike(postid, userId, likeStatus)
        if (alreadyLiked) {

            return alreadyLiked
        }

        const like: LikeDbType = {
            _id: new ObjectId(),
            post: postid,
            status: likeStatus,
            addedAt: new Date(),
            userId,
            login
        }

        return this.likesRepositories.createLike(like)
    }
}