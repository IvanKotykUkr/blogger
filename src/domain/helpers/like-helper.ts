import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {newestlike} from "../../types/posts-type";
import {LikesRepositories} from "../../repositories/likes-repositories";

@injectable()
export class LikeHelper {
    constructor(@inject(LikesRepositories) protected likesRepositories:LikesRepositories ) {
    }
    async likesCount(id:ObjectId):Promise<number>{

        return this.likesRepositories.countLike(id)
    }
    async dislikesCount(id:ObjectId):Promise<number>{

        return this.likesRepositories.countDislake(id)
    }
    async myStatus(id:ObjectId):Promise<string>{

        return this.likesRepositories.myStatus(id)
    }
    async newestLikes(id:ObjectId):Promise<newestlike[]>{

        return this.likesRepositories.newstLike(id)
    }

}