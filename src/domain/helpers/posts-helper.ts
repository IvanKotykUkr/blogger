import {PostsDBType, PostsResponseType, PostsResponseTypeWithPagination, PostsType} from "../../types/posts-type";
import {BloggerResponseType} from "../../types/blogger-type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {BloggersRepositories} from "../../repositories/bloggers-db-repositories";
import {PostsRepositories} from "../../repositories/posts-db-repositories";
import {LikeHelper} from "./like-helper";

@injectable()
export class PostsHelper {
    constructor(@inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(PostsRepositories) protected postsRepositories: PostsRepositories,
                @inject(LikeHelper) protected likeHelper: LikeHelper) {
    }

    async makePost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsDBType | null> {
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

    async getPostsPagination(pagenumber: number, pagesize: number, bloggerId?: ObjectId | undefined | string): Promise<PostsResponseTypeWithPagination> {


        let totalCount: number = await this.postsRepositories.findPostsByIdBloggerCount(bloggerId)
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)

        const itemsFromDb = await this.postsRepositories.findPostsByIdBloggerPagination(bloggerId, page, pageSize)
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

                        likesCount: await this.likeHelper.likesCount(p._id),
                        dislikesCount: await this.likeHelper.dislikesCount(p._id),
                        myStatus: await this.likeHelper.myStatus(p._id),
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


        // @ts-ignore
        return post
    }

    async makePostResponse(post: PostsType): Promise<PostsResponseType> {


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
                myStatus: await this.likeHelper.myStatus(new ObjectId(post.id)),
                // @ts-ignore
                newestLikes: await this.likeHelper.newestLikes(new ObjectId(post.id))
            }
        }
    }
}