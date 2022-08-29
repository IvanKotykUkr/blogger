import {PostsDBType, PostsResponseType, PostsResponseTypeWithPagination, PostsType} from "../../types/posts-type";
import {BloggerResponseType} from "../../types/blogger-type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {BloggersRepositories} from "../../repositories/bloggers-db-repositories";
import {PostsRepositories} from "../../repositories/posts-db-repositories";
import {LikeHelper} from "./like-helper";
import {ArrayCountIdType, ArrayIdType, LikeDbType} from "../../types/like-type";

@injectable()
export class PostsHelper {
    constructor(@inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(PostsRepositories) protected postsRepositories: PostsRepositories,
                @inject(LikeHelper) protected likeHelper: LikeHelper) {
    }

    async makePost(title: string, shortDescription: string, content: string, bloggerId: ObjectId): Promise<PostsDBType | null> {
        const blogger: BloggerResponseType | null = await this.bloggersRepositories.findBloggersById(new ObjectId(bloggerId))
        if (blogger) {
            const newPost: PostsDBType = {
                _id: new ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: new ObjectId(bloggerId),
                bloggerName: blogger.name,
                addedAt: new Date()
            }
            return newPost
        }
        return null
    }

    async getPostsPagination(pagenumber: number, pagesize: number, userId: ObjectId, bloggerId?: ObjectId | undefined): Promise<PostsResponseTypeWithPagination> {


        let totalCount: number = await this.postsRepositories.findPostsByIdBloggerCount(bloggerId)
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)

        const itemsFromDb: PostsDBType[] = await this.postsRepositories.findAllPosts(bloggerId, page, pageSize)
        const idItems = this.mapPostAndLikeOrDislike(itemsFromDb, "P")
        const likes = await this.likeHelper.findLikes(idItems)
        const dislike = await this.likeHelper.findDislike(idItems)
        const status = await this.likeHelper.findStatus(userId, idItems)
        const lastLikes = await this.likeHelper.findLastThreLikes(idItems)
        console.log(lastLikes)


        const postIdFromLikes = this.mapPostAndLikeOrDislike(likes, "L")
        const postIdFromDislike = this.mapPostAndLikeOrDislike(dislike, "L")
        const likesFromArray = this.countLikesOrDislikesFromArray(postIdFromLikes)
        const dislikeFromArray = this.countLikesOrDislikesFromArray(postIdFromDislike)

        const newItems = itemsFromDb.map(p => ({
            id: p._id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            bloggerId: p.bloggerId,
            bloggerName: p.bloggerName,
            addedAt: p.addedAt,
            extendedLikesInfo: {
                likesCount: this.findAmountLikeOrDislike(p._id, likesFromArray),
                dislikesCount: this.findAmountLikeOrDislike(p._id, dislikeFromArray),
                myStatus: this.findStatus(p._id,status),
                newestLikes: [],
            }
        }))

        const mapItems = async () => {
            return Promise.all(itemsFromDb.map(
                async p => ({
                    id: p._id,
                    title: p.title,
                    shortDescription: p.shortDescription,
                    content: p.content,
                    bloggerId: p.bloggerId,
                    bloggerName: p.bloggerName,
                    addedAt: p.addedAt,
                    extendedLikesInfo: {

                        likesCount: this.findAmountLikeOrDislike(p._id, likesFromArray),
                        dislikesCount: this.findAmountLikeOrDislike(p._id, dislikeFromArray),
                        myStatus: this.findStatus(p._id,status),
                        newestLikes: await this.likeHelper.newestLikes(p._id),
                    }

                })))
        }


        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: await mapItems(),

        }


        return post
    }

    countLikesOrDislikesFromArray(arr: ArrayIdType): ArrayCountIdType {

        const res = {};
        arr.forEach((obj) => {
            const key: ObjectId = obj._id;

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

    findAmountLikeOrDislike(id: ObjectId, likes: ArrayCountIdType): number {
        let amount: number = 0

        for (let i = 0; i < likes.length; i++) {
            if (id.toString() === likes[i]._id.toString()) {
                amount = likes[i].count

                break
            }
        }

        return amount

    }


    async makePostResponse(post: PostsType, userId?: ObjectId): Promise<PostsResponseType> {


        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName,
            addedAt: post.addedAt,
            extendedLikesInfo: {
                likesCount: await this.likeHelper.likesCount(new ObjectId(post.id)),
                dislikesCount: await this.likeHelper.dislikesCount(new ObjectId(post.id)),
                myStatus: await this.likeHelper.myStatus(new ObjectId(userId), new ObjectId(post.id)),
                newestLikes: await this.likeHelper.newestLikes(new ObjectId(post.id))
            }
        }
    }

    private mapPostAndLikeOrDislike(items: any, process: string) {
        if (process === "P") {
            return items.map((p: { _id: ObjectId; }) => ({
                _id: p._id,
            }))
        }
        return items.map((p: { post: ObjectId; }) => ({
            _id: p.post
        }))

    }

    findStatus(post:ObjectId,allStatus:LikeDbType[]){
       let status="None"
        for (let i = 0; i < allStatus.length; i++) {
            if(post.toString()===allStatus[i].post.toString()){

                status = allStatus[i].status
                break
            }

        }
        return status
    }
}

/*const mapItems = async () => {
            return Promise.all(itemsFromDb.map(
                async p => ({
                    id: p._id,
                    title: p.title,
                    shortDescription: p.shortDescription,
                    content: p.content,
                    bloggerId: p.bloggerId,
                    bloggerName: p.bloggerName,
                    addedAt: p.addedAt,
                    extendedLikesInfo: {

                        likesCount: await this.likeHelper.likesCount(p._id),
                        dislikesCount: await this.likeHelper.dislikesCount(p._id),
                        myStatus: await this.likeHelper.myStatus(userId, p._id),
                        newestLikes: await this.likeHelper.newestLikes(p._id),
                    }

                })))
        }*/