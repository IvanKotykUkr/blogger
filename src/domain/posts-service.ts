import {postsRepositories} from "../repositories/posts-db-repositories";
import {bloggersService} from "./bloggers-service";
import {commentsService} from "./comments-service";
import {BloggerType, CommentType, PostType, PostTypeInsert} from "../repositories/db";
import {ObjectId} from "mongodb";


export const postsService = {
    async convertToHex(id: string) {
        const hex = id.split("").reduce((hex, c) => hex += c.charCodeAt(0).toString(16).padStart(2, "0"), "")

        return hex
    },

    async findPostsByIdBlogger(pagenumber: number, pagesize: number, bloggerId?: string | null) {

        // @ts-ignore
        let totalCount = await postsRepositories.findPostsByIdBloggerCount(bloggerId)
        let page = pagenumber
        let pageSize = pagesize
        let pagesCount = Math.ceil(totalCount / pageSize)
        // @ts-ignore
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
    async findPostsById(id: string): Promise<PostType | null> {
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return null
        }
        const post: PostType | null = await postsRepositories.findPostsById(id)

        if (post) {
            return post;
        }
        return null;


    },
    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | null> {
        const blogger: BloggerType | null = await bloggersService.findBloggersById(bloggerId)
        if (blogger) {
            const newpost: PostType | null = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: new ObjectId(bloggerId),
                bloggerName: blogger.name,
            }
            await postsRepositories.createPost(newpost)
            return {
                id: newpost._id,
                title: newpost.title,
                shortDescription: newpost.shortDescription,
                content: newpost.content,
                bloggerId: newpost.bloggerId,
                bloggerName: newpost.bloggerName
            }
        }
        return null
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        const idHex = await this.convertToHex(id)
        if (idHex.length !== 48) {
            return false
        }

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