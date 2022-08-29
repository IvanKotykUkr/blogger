import {PostsDBType, PostsResponseType, PostsResponseTypeWithPagination, PostsType} from "../../types/posts-type";
import {BloggerResponseType} from "../../types/blogger-type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {BloggersRepositories} from "../../repositories/bloggers-db-repositories";
import {PostsRepositories} from "../../repositories/posts-db-repositories";
import {LikeHelper} from "./like-helper";
import {ArrayCountIdType, ArrayIdType, ArrayLikesType, LikeDbType, LikeOrDislikeIdType} from "../../types/like-type";

@injectable()
export class PostsHelper {
    constructor(@inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(PostsRepositories) protected postsRepositories: PostsRepositories,
                @inject(LikeHelper) protected likeHelper: LikeHelper) {
    }
    private takePostId(items: PostsDBType[]): ArrayIdType {

        return items.map((p: { _id: ObjectId; }) => ({
            _id: p._id,
        }))

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
        const idItems = this.takePostId(itemsFromDb)
        const likes = await this.likeHelper.findLikes(idItems)
        const dislikes = await this.likeHelper.findDislike(idItems)
        const status = await this.likeHelper.findStatus(userId, idItems)
        const allLikes = await this.likeHelper.findLastThreLikes(idItems)


        const items = itemsFromDb.map(p => ({
            id: p._id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            bloggerId: p.bloggerId,
            bloggerName: p.bloggerName,
            addedAt: p.addedAt,
            extendedLikesInfo: {
                likesCount: this.likeHelper.findAmountLikeOrDislike(p._id, likes),
                dislikesCount: this.likeHelper.findAmountLikeOrDislike(p._id, dislikes),
                myStatus: this.likeHelper.findStatusInArray(p._id, status),
                newestLikes: this.likeHelper.groupAndSortLikes(allLikes, p._id),
            }
        }))


        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items

        }



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