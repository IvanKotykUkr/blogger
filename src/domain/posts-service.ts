import {postsRepositories} from "../repositories/posts-db-repositories";
import {bloggersService} from "./bloggers-service";
import {commentsService} from "./comments-service";



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
    async findPostsById(id:string){
        const post =  postsRepositories.findPostsById(id)
        if(post) {
            return post;
        }else {
            return null;
        }

    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string){

        let blogger: any = await bloggersService.findBloggersById(bloggerId)
        let newpost;
        const id=  +(new Date())
        if (blogger) {
            newpost= {
                id:""+id,
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
    async updatePost(id:string,title: string, shortDescription: string, content: string, bloggerId: string){
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


    async deletePost(id:string) {
       return await postsRepositories.deletePost(id)


    },
    async findPostsByIdBlogger(bloggerId:string,pagenumber:number ,pagesize:number){

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
    async createPostByBloggerId(bloggerId:string,title:string,shortDescription:string,content:string,bloggerName:string){
        const id=  +(new Date())
       let newpost= {
           id:""+id,
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName,
        }
        const generatedPost = postsRepositories.createPost(newpost)
        return generatedPost
    },
    async createCommentsByPost(postid:string,content:string,userid:string,userLogin:string){
        let post = await this.findPostsById(postid)
        if (post){
            let newComment = await commentsService.createCommentsByPost(postid,content,userid,userLogin)
            return newComment
        }else {
            return null
        }
    },
    async sendAllCommentsByPostId(postid:string,pagenumber:number ,pagesize:number){
        let post = await this.findPostsById(postid)
        if (post){
            let allComments = await commentsService.sendAllCommentsByPostId(postid,pagenumber,pagesize)
            return allComments
        }else {
            return null
        }

    },

}