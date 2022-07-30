import {PostsDBType, PostsResponseType, PostsResponseTypeWithPagination} from "../../types/posts-type";
import {BloggerResponseType} from "../../types/blogger-type";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {BloggersService} from "../bloggers-service";
import {BloggersRepositories} from "../../repositories/bloggers-db-repositories";
import {PostsRepositories} from "../../repositories/posts-db-repositories";
@injectable()
export class PostsHelper {
    constructor(@inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(PostsRepositories)protected postsRepositories: PostsRepositories) {
    }

    async makePost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsDBType|null> {
        const blogger: BloggerResponseType | null = await this.bloggersRepositories.findBloggersById(new ObjectId(bloggerId))
        if (blogger) {
            const newPost: PostsDBType = {
                _id: new ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: new ObjectId(bloggerId),
                bloggerName: blogger.name,
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

        const items: PostsResponseType[] = await this.postsRepositories.findPostsByIdBloggerPagination(bloggerId, page, pageSize)
        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }
        return post
    }

}