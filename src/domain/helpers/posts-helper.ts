import {PostsDBType, PostsResponseType, PostsResponseTypeWithPagination, PostsType} from "../../types/posts-type";
import {BloggerResponseType} from "../../types/blogger-type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {BloggersRepositories} from "../../repositories/bloggers-db-repositories";
import {PostsRepositories} from "../../repositories/posts-db-repositories";
import {LikesRepositories} from "../../repositories/likes-repositories";

@injectable()
export class PostsHelper {
    constructor(@inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(PostsRepositories) protected postsRepositories: PostsRepositories,
                @inject(LikesRepositories) protected likesRepositories: LikesRepositories) {
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

        const items = await this.postsRepositories.findPostsByIdBloggerPagination(bloggerId, page, pageSize)

        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }

        // @ts-ignore
        return post
    }

    async makePostResponse(post: PostsType): Promise<PostsResponseType> {

        const likesCount =await this.likesRepositories.countLike(new ObjectId(post.id))
        const dislikesCount =await this.likesRepositories.countDislake(new ObjectId(post.id))
        const myStatus = await this.likesRepositories.myStatus(new ObjectId(post.id))
        const newestLikes = await this.likesRepositories.newstLike(new ObjectId(post.id))



        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName,
            addedAt: post.addedAt,
            extendedLikesInfo:{
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: myStatus,
                // @ts-ignore
                newestLikes: newestLikes
            }
        }
    }
}