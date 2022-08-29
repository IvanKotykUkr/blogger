import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {NewestLike} from "../../types/posts-type";
import {LikesRepositories} from "../../repositories/likes-repositories";
import {
    ArrayCountIdType,
    ArrayIdType,
    ArrayLikesType,
    LikeDbType,
    LikeOrDislikeIdType,
    NewestThreeLikes,
    StatusLikeOrDislikeType
} from "../../types/like-type";

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

    countLikesOrDislikesFromArray(likesOrDislikesId: LikeOrDislikeIdType): ArrayCountIdType {

        const res = {};
        likesOrDislikesId.forEach((obj) => {
            const key: ObjectId = obj.post;

            // @ts-ignore
            if (!res[key]) {
                // @ts-ignore
                res[key] = {...obj, count: 0};
            }
            ;
            // @ts-ignore
            res[key].count += 1;
        });
        return Object.values(res);
    }

    findAmountLikeOrDislike(id: ObjectId, likesOrDislikesId: LikeOrDislikeIdType): number {
        const likesOrDislikes=this.countLikesOrDislikesFromArray(likesOrDislikesId)
        let amount: number = 0

        for (let i = 0; i < likesOrDislikes.length; i++) {
            if (id.toString() === likesOrDislikes[i].post.toString()) {
                amount = likesOrDislikes[i].count

                break
            }
        }

        return amount

    }

    findStatusInArray(post: ObjectId, allStatus: StatusLikeOrDislikeType): string {
        let status = "None"
        for (let i = 0; i < allStatus.length; i++) {
            if (post.toString() === allStatus[i].post.toString()) {

                status = allStatus[i].status
                break
            }

        }
        return status
    }

    groupAndSortLikes(likes: ArrayLikesType, id: ObjectId): NewestThreeLikes[] {
        let lastThreeLikes = []
        for (let i = likes.length - 1; i >= 0; i--) {

            if (id.toString() === likes[i].post.toString()) {
                lastThreeLikes.push(likes[i])

            }
            if (lastThreeLikes.length === 3) break

        }


        return lastThreeLikes.map(d => ({addedAt: d.addedAt, userId: d.userId, login: d.login}))
    }


    async findLikes(id: ArrayIdType): Promise<LikeOrDislikeIdType> {
        return this.likesRepositories.findLikesInDb(id)

    }

    async findDislike(id: ArrayIdType): Promise<LikeOrDislikeIdType> {
        return this.likesRepositories.findDislikeInDb(id)

    }

    async findStatus(id: ObjectId, idItems: ArrayIdType): Promise<StatusLikeOrDislikeType> {
        if (id.toString() === "630a2e022e212e98223c97ba") {
            return []
        } else {
            return this.likesRepositories.findStatus(id, idItems)
        }
    }

    async findLastThreLikes(idItems: ArrayIdType): Promise<ArrayLikesType> {
        return this.likesRepositories.findLastLikes(idItems)

    }
}