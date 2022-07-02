import {bloggersRepositories} from "../repositories/bloggers-db-repositories";
import {postsService} from "./posts-service";
import {BloggerType, PostType} from "../repositories/db";
import {WithId} from "mongodb";


export const bloggersService = {

    async getBloggers(searchnameterm: any, pagesize: number, pagenumber: number) {
        let totalCount: number = await bloggersRepositories.getBloggersCount()
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        if (!searchnameterm) {
            const items = await bloggersRepositories.getBloggersPaginaton(pageSize, page)
            return {
                pagesCount,
                page,
                pageSize,
                totalCount,
                items,
            }
        }
        let totalCountSearch: number = await bloggersRepositories.blooggersSeachCount(searchnameterm)
        let pagesCountSearch: number = Math.ceil(totalCountSearch / pageSize)
        const itemsSearch = await bloggersRepositories.getBloggersSearchTerm(page, pageSize, searchnameterm)
        return {
            pagesCount: pagesCountSearch,
            page,
            pageSize,
            totalCount: totalCountSearch,
            items: itemsSearch,
        }


    },


    async findBloggersById(id: string): Promise<BloggerType | null> {
        let blogger: BloggerType | null = await bloggersRepositories.findBloggersById(id)
        if (blogger) {
            return blogger;
        }
        return null;


    },

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
        const newBlogger: BloggerType = {
            id: "" + (+(new Date())),
            name: name,
            youtubeUrl: youtubeUrl
        }
        await bloggersRepositories.createBlogger(newBlogger)
        return {
            id: newBlogger.id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    },
    async updateBloggers(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const blogger: BloggerType = {
            id,
            name,
            youtubeUrl
        }
        return await bloggersRepositories.updateBloggers(blogger)
    },
    async deleteBloggers(id: string): Promise<boolean> {
        return await bloggersRepositories.deleteBloggers(id)
    },
    async getPostsbyIdBlogger(id: string, pagenumber: number, pageesize: number) {
        let blogger: BloggerType | null = await this.findBloggersById(id)
        if (blogger) {
            let findPosts: any = await postsService.findPostsByIdBlogger(blogger.id, pagenumber, pageesize)
            return findPosts
        }
        return null

    },
    async createPostbyBloggerId(id: string, title: string, shortDescription: string, content: string): Promise<PostType | null> {
        let blogger: BloggerType | null = await this.findBloggersById(id)
        if (blogger) {
            let newPosts: PostType = await postsService.createPostByBloggerId(blogger.id, title, shortDescription, content, blogger.name)
            return {
                id: newPosts.id,
                title: newPosts.title,
                shortDescription: newPosts.shortDescription,
                content: newPosts.content,
                bloggerId: newPosts.bloggerId,
                bloggerName: newPosts.bloggerName
            }
        }
        return null


    }
}
