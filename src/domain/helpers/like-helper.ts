import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {NewestLike} from "../../types/posts-type";
import {LikesRepositories} from "../../repositories/likes-repositories";
import {ArrayIdType, LikeDbType} from "../../types/like-type";

@injectable()
export class LikeHelper {
    constructor(@inject(LikesRepositories) protected likesRepositories: LikesRepositories) {
    }


    async likesCount(id: ObjectId) {

        return this.likesRepositories.countLike(id)
    }

    async dislikesCount(id: ObjectId): Promise<number> {

        return this.likesRepositories.countDislake(id)
    }

    async myStatus(id: ObjectId, post: ObjectId): Promise<string> {
        if (id.toString() === "630a2e022e212e98223c97ba") {
            return "None"
        }
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

    async findLikes(id: ArrayIdType) {
        return this.likesRepositories.findLikesInDb(id)

    }

    async findDislike(id: ArrayIdType) {
        return this.likesRepositories.findDislikeInDb(id)

    }

    async findStatus(id: ObjectId, idItems: ArrayIdType) {
        if (id.toString() === "630a2e022e212e98223c97ba") {
            return []
        } else {
            return this.likesRepositories.findStatus(id, idItems)
        }
    }

    async findLastThreLikes(idItems: ArrayIdType) {
        return this.likesRepositories.findLastLikes(idItems)

    }
}