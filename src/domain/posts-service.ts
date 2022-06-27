import {postsRepositories} from "../repositories/posts-db-repositories";
import {bloggersService} from "./bloggers-service";



export const postsService = {
    async getPosts(pagenumber:number ,pagesize:number){


        let totalCount =  await  postsRepositories.getPostsCount()
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        const items = await postsRepositories.getPostsPagination(page, pageSize)
        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }
        return post
    },
    async findPostsById(id:number){
        return   postsRepositories.findPostsById(id)

    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: number){

        let blogger: any = await bloggersService.findBloggersById(bloggerId)
        let newpost;

        if (blogger) {
            newpost= {
                id: +(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: blogger.name,
            }
            await postsRepositories.createPost(newpost)
            return {
                id:newpost.id,
                title:newpost.title,
                shortDescription:newpost.shortDescription,
                content:newpost.content,
                bloggerId:newpost.bloggerId,
                bloggerName:newpost.bloggerName
            }
        } else {
            newpost = null
        }

        return(newpost)
    },
    async updatePost(id:number,title: string, shortDescription: string, content: string, bloggerId: number,){
        let blogger:any = await bloggersService.findBloggersById(bloggerId)

        let upPost= await postsService.findPostsById(id)

        if( blogger) {
            if (upPost)  {
               return   await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId, blogger.name)


            } else {
                return undefined
            }

        }else {
            return null
        }
    },


    async deletePost(id:number) {
       return await postsRepositories.deletePost(id)


    },
    async findPostsByIdBlogger(bloggerId:number,pagenumber:number ,pagesize:number){

        let totalCount = await  postsRepositories.findPostsByIdBloggerCount(bloggerId)
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        const items = await postsRepositories.findPostsByIdBloggerPagination(bloggerId,page, pageSize)
        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }
        return post
    },
    async createPostByBloggerId(bloggerId:number,title:string,shortDescription:string,content:string,bloggerName:string){
       let newpost= {
            id: +(new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName,
        }
        const generatedPost = postsRepositories.createPost(newpost)
        return generatedPost
    }

}