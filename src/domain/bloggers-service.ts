import {bloggersRepositories} from "../repositories/bloggers-db-repositories";
import {postsService} from "./posts-service";
import {BloggerType} from "../repositories/db";


export const bloggersService = {

    async getBloggers(searchnameterm: any, pagesize: number, pagenumber: number) {
        let totalCount = await bloggersRepositories.getBloggersCount()
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
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
        let totalCountSearch = await bloggersRepositories.blooggersSeachCount(searchnameterm)
        let pagesCountSearch = Math.ceil(totalCountSearch / pageSize)
        const itemsSearch = await bloggersRepositories.getBloggersSearchTerm(page, pageSize, searchnameterm)
        return {
            pagesCount: pagesCountSearch,
            page,
            pageSize,
            totalCount: totalCountSearch,
            items: itemsSearch,
        }


    },


    async findBloggersById(id: string) {
        let blogger = await bloggersRepositories.findBloggersById(id)
        if (blogger) {
            return blogger;
        }
        return null;


    },

    async createBlogger(name: string, youtubeUrl: string) {
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
    async updateBloggers(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        const blogger: BloggerType = {
            id,
            name,
            youtubeUrl
        }
        return await bloggersRepositories.updateBloggers(blogger)
    },
    async deleteBloggers(id: string) {
        return await bloggersRepositories.deleteBloggers(id)
    },
    async getPostsbyIdBlogger(id: string, pagenumber: number, pageesize: number) {
        let blogger: any = await this.findBloggersById(id)
        if (blogger) {
            let findPosts: any = await postsService.findPostsByIdBlogger(blogger.id, pagenumber, pageesize)
            return findPosts
        }
        return null

    },
    async createPostbyBloggerId(id: string, title: string, shortDescription: string, content: string) {
        let blogger: any = await this.findBloggersById(id)
        if (blogger) {
            let newPosts: any = await postsService.createPostByBloggerId(blogger.id, title, shortDescription, content, blogger.name)
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
