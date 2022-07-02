import {postsRepositories} from "../repositories/posts-db-repositories";
import {bloggersService} from "./bloggers-service";
import {commentsService} from "./comments-service";
import {BloggerType, CommentType, PostType} from "../repositories/db";


export const postsService = {
    async getPosts(pagenumber: number, pagesize: number) {


        let totalCount = await postsRepositories.getPostsCount()
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
    async findPostsById(id: string): Promise<PostType | null> {
        const post: PostType | null = await postsRepositories.findPostsById(id)

        if (post) {
            return post;
        }
        return null;


    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | null> {

        let blogger: BloggerType | null = await bloggersService.findBloggersById(bloggerId)
        let newpost: PostType | null;
        const id = +(new Date())
        if (blogger) {
            newpost = {
                id: "" + id,
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId,
                bloggerName: blogger.name,
            }
            await postsRepositories.createPost(newpost)
            return {
                id: newpost.id,
                title: newpost.title,
                shortDescription: newpost.shortDescription,
                content: newpost.content,
                bloggerId: newpost.bloggerId,
                bloggerName: newpost.bloggerName
            }
        }
        return newpost = null


    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        let blogger: BloggerType | null = await bloggersService.findBloggersById(bloggerId)

        let upPost: PostType | null = await postsService.findPostsById(id)

        if (upPost) {
            if (blogger) {
                return await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId, blogger.name)
            }
            return null
        }
        return false

    },


    async deletePost(id: string): Promise<boolean> {
        return await postsRepositories.deletePost(id)


    },
    async findPostsByIdBlogger(bloggerId: string, pagenumber: number, pagesize: number) {

        let totalCount = await postsRepositories.findPostsByIdBloggerCount(bloggerId)
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        const items = await postsRepositories.findPostsByIdBloggerPagination(bloggerId, page, pageSize)
        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }
        return post
    },
    async createPostByBloggerId(bloggerId: string, title: string, shortDescription: string, content: string, bloggerName: string): Promise<PostType> {

        let newpost: PostType = {
            id: "" + (+(new Date())),
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName,
        }
        // @ts-ignore
        const generatedPost: PostType = await postsRepositories.createPost(newpost)
        return generatedPost
    },
    async createCommentsByPost(postid: string, content: string, userid: string, userLogin: string): Promise<CommentType | null> {
        let post: PostType | null = await this.findPostsById(postid)
        if (post) {
            let newComment: CommentType = await commentsService.createCommentsByPost(postid, content, userid, userLogin)
            return newComment
        }
        return null

    },
    async sendAllCommentsByPostId(postid: string, pagenumber: number, pagesize: number) {
        let post: PostType | null = await this.findPostsById(postid)

        if (post) {
            let allComments = await commentsService.sendAllCommentsByPostId(postid, pagenumber, pagesize)
            return allComments
        }
        return null


    },

}