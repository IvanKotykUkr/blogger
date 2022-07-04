import {bloggersRepositories} from "../repositories/bloggers-db-repositories";
import {postsService} from "./posts-service";
import {BloggerType, PostType} from "../repositories/db";
import {ObjectId, WithId} from "mongodb";


export const bloggersService = {
    async convertToHex(id: string) {
        const hex = id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")

        return hex
    },
    getBloggers: async function (searchnameterm: string | null, pagesize: number, pagenumber: number) {
        let page: number = pagenumber
        let pageSize: number = pagesize
        let totalCountSearch: number = await bloggersRepositories.blooggersSeachCount(searchnameterm)
        let pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize)
        const itemsSearch = await bloggersRepositories.getBloggersSearchTerm(pageSize, page, searchnameterm)
        return {
            pagesCount: pagesCountSearch,
            page,
            pageSize,
            totalCount: totalCountSearch,
            items: itemsSearch,
        }
    },
    async findBloggersById(id: string): Promise<BloggerType | null> {
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return null
        }
        let blogger: BloggerType | null = await bloggersRepositories.findBloggersById(id)
        if (blogger) {
            return blogger;
        }
        return null;
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
        const newBlogger: BloggerType = {
            name: name,
            youtubeUrl: youtubeUrl
        }
        await bloggersRepositories.createBlogger(newBlogger)
        return {
            id: newBlogger._id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    },
    async updateBloggers(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        const blogger: BloggerType = {
            id: new ObjectId(id),
            name,
            youtubeUrl
        }
        return await bloggersRepositories.updateBloggers(blogger)
    },
    async deleteBloggers(id: string): Promise<boolean> {
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }
        return await bloggersRepositories.deleteBloggers(id)
    },
    async getPostsbyIdBlogger(id: string, pagenumber: number, pageesize: number) {

        let blogger: BloggerType | null = await this.findBloggersById(id)

        if (blogger) {
            // @ts-ignore
            let findPosts: any = await postsService.findPostsByIdBlogger(pagenumber, pageesize, blogger.id)
            return findPosts
        }
        return null

    },
    async createPostbyBloggerId(id: string, title: string, shortDescription: string, content: string): Promise<PostType | null> {

        let newPosts: PostType | null = await postsService.createPost(title, shortDescription, content, id)
        if (newPosts) {

            return newPosts
        }
        return null


    }
}
