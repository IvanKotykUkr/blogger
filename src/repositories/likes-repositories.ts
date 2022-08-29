import "reflect-metadata";
import {injectable} from "inversify";
import {ArrayIdType, LikeDbType} from "../types/like-type";
import {LikesModelClass} from "./db";
import {ObjectId} from "mongodb";
import {NewestLike} from "../types/posts-type";

@injectable()
export class LikesRepositories {

    async createLike(like: LikeDbType): Promise<LikeDbType> {
        const likeInstance = new LikesModelClass()

        likeInstance._id = like._id
        likeInstance.post = like.post
        likeInstance.status = like.status
        likeInstance.addedAt = like.addedAt
        likeInstance.userId = like.userId
        likeInstance.login = like.login
        await likeInstance.save()
        return likeInstance

    }

    async countLike(post: ObjectId): Promise<number> {
        const b = await LikesModelClass.find({post, status: "Like"}).exec()
        return b.length
    }

    async countDislake(post: ObjectId): Promise<number> {
        return LikesModelClass.countDocuments({post, status: "Dislike"})
    }

    async myStatus(userId: ObjectId, post: ObjectId): Promise<string> {

        const status: LikeDbType | null = await LikesModelClass.findOne({$and: [{post}, {userId}]})
        if (status) {
            return status.status
        }
        return "None"
    }

    async newstLike(post: ObjectId): Promise<NewestLike[]> {
        const likeInstance = await LikesModelClass.find({$and: [{post}, {status: "Like"}]})
            .sort({addedAt: -1})
            .limit(3)
            .lean()
        return likeInstance.map(d => ({addedAt: d.addedAt, userId: d.userId, login: d.login}))
    }

    async findLike(post: ObjectId, userId: ObjectId, status: string): Promise<LikeDbType | boolean> {
        const likeInstance = await LikesModelClass.findOne({$and: [{post}, {userId}]})
        if (!likeInstance) {
            return false
        }
        likeInstance.status = status
        await likeInstance.save()

        return likeInstance


    }

    async findLikesInDb(post: ArrayIdType) {

        return LikesModelClass.find({post, status: "Like"}).lean()

    }

    async findDislikeInDb(post: ArrayIdType) {

        return LikesModelClass.find({post, status: "Dislike"}).lean()
    }

    async findStatus(userId: ObjectId, post: ArrayIdType) {

        return LikesModelClass.find({$and: [{post}, {userId}]}).lean()
    }

   async findLastLikes(post: ArrayIdType) {
        return  LikesModelClass.find({$and: [{post}, {status: "Like"}]})
           .lean()
    }
}
