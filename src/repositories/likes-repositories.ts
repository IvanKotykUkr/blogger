import {injectable} from "inversify";
import {LikeDbType} from "../types/like-type";
import {LikesModelClass} from "./db";
import {ObjectId} from "mongodb";

@injectable()
export class LikesRepositories {

    async createLike(like: LikeDbType) {
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

        return  LikesModelClass.countDocuments({post, status: "Like"})
    }

    async countDislake(post: ObjectId) {
        return LikesModelClass.countDocuments({post, status: "Dislike"})
    }

    async myStatus(userId: ObjectId,post:ObjectId) {

        const status: LikeDbType | null = await LikesModelClass.findOne({$and: [{post}, {userId}]})
        if (status) {
            return status.status
        }
        return "None"
    }

    async newstLike(post: ObjectId) {
        const likeInstance = await LikesModelClass.find({post})
            .sort({addedAt: -1})
            .limit(3)
            .lean()
        return likeInstance.map(d => ({addedAt: d.addedAt, userId: d.userId, login: d.login}))
    }

    async findLike(post: ObjectId, userId: ObjectId, status: string) {
        const likeInstance = await LikesModelClass.findOne({$and: [{post}, {userId}]})


        if (likeInstance) {
            likeInstance.status = status
            await likeInstance.save()

            return likeInstance
        }
        return false

    }
}