import {ObjectId} from "mongodb";
import {
    BloggerDBType,
    BloggerResponseType,
    BloggerResponseTypeWithPagination,
    BloggerType
} from "../types/blogger-type";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {BloggersRepositories} from "../repositories/bloggers-db-repositories";
import {PostsRepositories} from "../repositories/posts-db-repositories";
import {PostsHelper} from "./helpers/posts-helper";

@injectable()
export class BloggersService {


    constructor(@inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(PostsRepositories) protected postsRepositories: PostsRepositories,
                @inject(PostsHelper) protected postsHelper: PostsHelper) {

    }


    async getBloggers(searchnameterm: string | null, pagesize: number, pagenumber: number): Promise<BloggerResponseTypeWithPagination> {
        let page: number = pagenumber
        let pageSize: number = pagesize
        let totalCountSearch: number = await this.bloggersRepositories.blooggersSeachCount(searchnameterm)
        let pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize)
        const itemsSearch: BloggerResponseType[] = await this.bloggersRepositories.getBloggersSearchTerm(pageSize, page, searchnameterm)
        return {
            pagesCount: pagesCountSearch,
            page,
            pageSize,
            totalCount: totalCountSearch,
            items: itemsSearch,
        }
    }

    async findBloggersById(id: string): Promise<BloggerResponseType | null> {
        let blogger: BloggerResponseType | null = await this.bloggersRepositories.findBloggersById(new ObjectId(id))
        if (blogger) {
            return blogger;
        }
        return null;
    }

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerResponseType> {
        const newBlogger = new BloggerDBType(
            new ObjectId(),
            name,
            youtubeUrl
        )

        return await this.bloggersRepositories.createBlogger(newBlogger)
    }

    async updateBloggers(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const blogger: BloggerType = {
            _id: new ObjectId(id),
            name,
            youtubeUrl
        }
        return await this.bloggersRepositories.updateBloggers(blogger)
    }

    async deleteBloggers(id: string): Promise<boolean> {

        return await this.bloggersRepositories.deleteBloggers(id)
    }

    async getPostsByIdBlogger(id: string, pagenumber: number, pageesize: number): Promise<PostsResponseTypeWithPagination | null> {

        let blogger: BloggerResponseType | null = await this.findBloggersById(id)

        if (blogger) {

            return await this.postsHelper.getPostsPagination(pagenumber, pageesize, blogger.id)
        }
        return null

    }


    async createPostByBloggerId(id: string, title: string, shortDescription: string, content: string): Promise<PostsResponseType | null> {


        const makedPost = await this.postsHelper.makePost(title, shortDescription, content, id)
        if (makedPost) {
            let
                newPosts = await this.postsRepositories.createPost(makedPost)


            return this.postsHelper.makePostResponse(newPosts)

        }
        return null


    }
}
