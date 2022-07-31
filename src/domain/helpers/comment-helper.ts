import {inject, injectable} from "inversify";
import {CommentResponseType} from "../../types/commnet-type";
import {ObjectId} from "mongodb";
import {LikesRepositories} from "../../repositories/likes-repositories";

@injectable()
export class CommentHelper {

    constructor(@inject(LikesRepositories) protected likesRepositories: LikesRepositories) {
    }

    async createResponseComment(comment: CommentResponseType | null) {

        if (comment) {
            const likesCount = await this.likesRepositories.countLike(new ObjectId(comment.id))
            const dislikesCount = await this.likesRepositories.countDislake(new ObjectId(comment.id))
            const myStatus = await this.likesRepositories.myStatus(new ObjectId(comment.userId))


            return {
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: comment.addedAt,
                likesInfo: {
                    likesCount: likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: myStatus,
                }
            }
        }
    }

}