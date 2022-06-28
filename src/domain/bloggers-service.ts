
import {bloggersRepositories} from "../repositories/bloggers-db-repositories";
import {postsService} from "./posts-service";





export const bloggersService = {

    async getBloggers(searchnameterm: any,pagesize:number,pagenumber:number ){




        let totalCount = await bloggersRepositories.getBloggersCount()
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)


        if(!searchnameterm) {
            const items = await bloggersRepositories.getBloggersPaginaton(pageSize,page )
            let blogger = {
                pagesCount,
                page,
                pageSize,
                totalCount,
                items,

            }
            return blogger
        }else {

            let totalCountSearch =  await bloggersRepositories.blooggersSeachCount(searchnameterm)
            let pagesCountSearch = Math.ceil(totalCountSearch / pageSize)
            const itemsSearch = await bloggersRepositories.getBloggersSearchTerm(page, pageSize,searchnameterm)
            let blogger = {
                pagesCount:pagesCountSearch,
                page,
                pageSize,
                totalCount:totalCountSearch,
                items:itemsSearch,
            }
            return  blogger
        }
    },


    async findBloggersById(id: string) {
        let blogger= await bloggersRepositories.findBloggersById(id)
        if(blogger) {
            return blogger;
        }else {
            return null;
        }

    },


    async createBlogger(name:string,youtubeUrl:string){
        const id = +(new Date())

        const newBlogger={
            id:""+id,
            name:name,
            youtubeUrl:youtubeUrl
        }
        await bloggersRepositories.createBlogger(newBlogger)
        return {
            id:newBlogger.id,
            name:newBlogger.name,
            youtubeUrl:newBlogger.youtubeUrl
        }


    },
    async updateBloggers(id:string,name:string,youtubeUrl:string){
        return await bloggersRepositories.updateBloggers(id,name,youtubeUrl)


    },
    async deleteBloggers(id:string) {
        return await bloggersRepositories.deleteBloggers(id)
    },
    async getPostsbyIdBlogger(id:string,pagenumber:number ,pageesize:number) {
        let blogger: any = await this.findBloggersById(id)
        if (blogger){
            let findPosts:any= await postsService.findPostsByIdBlogger(blogger.id,pagenumber,pageesize)
            return findPosts
        }else {
            return null
        }


    },
    async createPostbyBloggerId(id:string,title:string,shortDescription:string,content:string){
       id

        let blogger: any = await this.findBloggersById(id)
        if (blogger) {
            let newPosts: any = await postsService.createPostByBloggerId(blogger.id, title, shortDescription, content,blogger.name)
            return {
                id:newPosts.id,
                title:newPosts.title,
                shortDescription:newPosts.shortDescription,
                content:newPosts.content,
                bloggerId:newPosts.bloggerId,
                bloggerName:newPosts.bloggerName
            }
        }else {
            return  null
        }

    }
}
