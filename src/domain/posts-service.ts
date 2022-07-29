import {PostsRepositories} from "../repositories/posts-db-repositories";

import {CommentsService} from "./comments-service";

import {ObjectId} from "mongodb";
import {PostsDBType, PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";
import {BloggerResponseType} from "../types/blogger-type";
import {CommentResponseType, CommentsResponseTypeWithPagination} from "../types/commnet-type";
import {bloggersService} from "../composition-root";


export class PostsService {


    constructor(protected postsRepositories: PostsRepositories, protected commentsService: CommentsService) {


    }


    async findPosts(pagenumber: number, pagesize: number, bloggerId?: ObjectId | undefined | string): Promise<PostsResponseTypeWithPagination> {


        let totalCount: number = await this.postsRepositories.findPostsByIdBloggerCount(bloggerId)
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)

        const items: PostsResponseType[] = await this.postsRepositories.findPostsByIdBloggerPagination(bloggerId, page, pageSize)
        let post = {
            pagesCount,
            page,
            pageSize,
            totalCount,
            items,

        }
        return post
    }

    async findPostsById(id: string): Promise<PostsResponseType | null> {

        const post: PostsResponseType | null = await this.postsRepositories.findPostsById(new ObjectId(id))

        if (post) {
            return post;
        }
        return null;


    }

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsResponseType | null> {
        const blogger: BloggerResponseType | null = await bloggersService.findBloggersById(bloggerId)
        if (blogger) {
            const newPost: PostsDBType = {
                _id: new ObjectId(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: new ObjectId(bloggerId),
                bloggerName: blogger.name,
            }
            return await this.postsRepositories.createPost(newPost)
            /* return {
                 id: newpost._id,
                 title: newpost.title,
                 shortDescription: newpost.shortDescription,
                 content: newpost.content,
                 bloggerId: newpost.bloggerId,
                 bloggerName: newpost.bloggerName
             }

             */
        }
        return null
    }

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: string): Promise<boolean | null> {


        let blogger: BloggerResponseType | null = await bloggersService.findBloggersById(bloggerId)


        if (blogger) {
            return await this.postsRepositories.updatePost(new ObjectId(id), title, shortDescription, content, new ObjectId(bloggerId), blogger.name)
        }


        return false

    }


    async deletePost(id: string): Promise<boolean> {

        const isDeleted = await this.postsRepositories.deletePost(new ObjectId(id))
        if (isDeleted) {
            return await this.commentsService.deleteCommentsByPost(id)
        }
        return false


    }


    async createCommentsByPost(postid: string, content: string, userid: string, userLogin: string): Promise<CommentResponseType | null> {
        let post = await this.findPostsById(postid)

        if (post) {
            let newComment: CommentResponseType | null = await this.commentsService.createCommentsByPost(postid, content, userid, userLogin)
            return newComment
        }
        return null

    }

    async sendAllCommentsByPostId(postid: string, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination | null> {
        let post: PostsResponseType | null = await this.findPostsById(postid)

        if (post) {
            let allComments: CommentsResponseTypeWithPagination = await this.commentsService.sendAllCommentsByPostId(new ObjectId(postid), pagenumber, pagesize)
            return allComments
        }
        return null


    }
}

