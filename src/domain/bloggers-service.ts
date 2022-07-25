import {BloggersRepositories} from "../repositories/bloggers-db-repositories";
import {PostsService} from "./posts-service";
import {ObjectId} from "mongodb";
import {
    BloggerDBType,
    BloggerResponseType,
    BloggerResponseTypeWithPagination,
    BloggerType
} from "../types/blogger-type";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";

export class BloggersService{
    bloggersRepositories:BloggersRepositories
    postsService:PostsService

    constructor() {
        this.bloggersRepositories=new BloggersRepositories()
        this.postsService=new PostsService()
    }
    async convertToHex(id: string): Promise<string> {
        return id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")
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
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return null
        }
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
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        const blogger: BloggerType = {
            _id: new ObjectId(id),
            name,
            youtubeUrl
        }
        return await this.bloggersRepositories.updateBloggers(blogger)
    }
    async deleteBloggers(id: string): Promise<boolean> {
        const idHex: string = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        return await this.bloggersRepositories.deleteBloggers(id)
    }
    async getPostsByIdBlogger(id: string, pagenumber: number, pageesize: number): Promise<PostsResponseTypeWithPagination | null> {

        let blogger: BloggerResponseType | null = await this.findBloggersById(id)

        if (blogger) {

            return await this.postsService.findPosts(pagenumber, pageesize, blogger.id)
        }
        return null

    }
    async createPostByBloggerId(id: string, title: string, shortDescription: string, content: string): Promise<PostsResponseType | null> {
        let blogger: BloggerResponseType | null = await this.findBloggersById(id)

        if (blogger) {

            let newPosts: PostsResponseType | null = await this.postsService.createPost(title, shortDescription, content, id)


            return newPosts

        }
        return null


    }
}
