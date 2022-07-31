import "reflect-metadata";
import {PostsRepositories} from "../repositories/posts-db-repositories";

import {CommentsService} from "./comments-service";


import {PostsResponseType, PostsResponseTypeWithPagination, PostsType} from "../types/posts-type";
import {BloggerResponseType} from "../types/blogger-type";
import {CommentResponseType, CommentsResponseTypeWithPagination} from "../types/commnet-type";


import {inject, injectable} from "inversify";
import {PostsHelper} from "./helpers/posts-helper";
import {BloggersRepositories} from "../repositories/bloggers-db-repositories";
import {ExtendedLikesInfo, LikeDbType} from "../types/like-type";
import {ObjectId} from "mongodb";
import {LikesRepositories} from "../repositories/likes-repositories";


@injectable()
export class PostsService {


    constructor(@inject(PostsRepositories) protected postsRepositories: PostsRepositories,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(PostsHelper) protected postsHelper: PostsHelper,
                @inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(LikesRepositories) protected likesRepositories: LikesRepositories
    ) {


    }


    async findPosts(pagenumber: number, pagesize: number, bloggerId?: ObjectId | undefined | string): Promise<PostsResponseTypeWithPagination> {


        return this.postsHelper.getPostsPagination(pagenumber, pagesize, bloggerId)
    }

    async findPostsById(id: string): Promise<PostsResponseType | null> {

        const post: PostsType | null = await this.postsRepositories.findPostsById(new ObjectId(id))

        if (post) {

            return this.postsHelper.makePostResponse(post);
        }
        return null;


    }

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostsResponseType | null> {
        const makedPost = await this.postsHelper.makePost(title, shortDescription, content, bloggerId)

        if (makedPost) {
            const post: PostsType = await this.postsRepositories.createPost(makedPost)
            const extendedLikesInfo:ExtendedLikesInfo ={
                likesCount:await this.likesRepositories.countLike(new ObjectId(post.id)),
                dislikesCount:await this.likesRepositories.countDislake(new ObjectId(post.id)),
                myStatus:await this.likesRepositories.myStatus(new ObjectId(post.id)),
                newestLikes:await this.likesRepositories.newstLike(new ObjectId(post.id))

            }


            return {
                id:post.id,

                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
                bloggerName: post.bloggerName,
                addedAt:post.addedAt,
                likesCount:extendedLikesInfo.likesCount,
                dislikesCount:extendedLikesInfo.dislikesCount,
                myStatus:extendedLikesInfo.myStatus,
                newestLikes:extendedLikesInfo.newestLikes

            }
        }

        return null
    }

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: string): Promise<boolean | null> {


        let blogger: BloggerResponseType | null = await this.bloggersRepositories.findBloggersById(new ObjectId(bloggerId))


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

    async updateLikeStatus(likeStatus: string, postid: ObjectId, userId: ObjectId, login: string) {

        const like: LikeDbType = {
            _id: new ObjectId(),
            post: postid,
            status: likeStatus,
            addedAt: new Date(),
            userId,
            login

        }
        return this.likesRepositories.createLike(like)


        return true

    }
}

