import "reflect-metadata";
import {PostsRepositories} from "../repositories/posts-db-repositories";


import {PostsResponseType, PostsResponseTypeWithPagination, PostsType} from "../types/posts-type";
import {BloggerResponseType} from "../types/blogger-type";
import {CommentsResponseTypeWithPagination, NewCommentType} from "../types/commnet-type";


import {inject, injectable} from "inversify";
import {PostsHelper} from "./helpers/posts-helper";
import {BloggersRepositories} from "../repositories/bloggers-db-repositories";
import {LikeDbType} from "../types/like-type";
import {ObjectId} from "mongodb";
import {LikesRepositories} from "../repositories/likes-repositories";
import {CommentHelper} from "./helpers/comment-helper";


@injectable()
export class PostsService {


    constructor(@inject(PostsRepositories) protected postsRepositories: PostsRepositories,
                @inject(PostsHelper) protected postsHelper: PostsHelper,
                @inject(BloggersRepositories) protected bloggersRepositories: BloggersRepositories,
                @inject(LikesRepositories) protected likesRepositories: LikesRepositories,
                @inject(CommentHelper) protected commentHelper: CommentHelper,
    ) {


    }


    async findPosts(pagenumber: number, pagesize: number, bloggerId?: ObjectId | undefined | string): Promise<PostsResponseTypeWithPagination> {


        return this.postsHelper.getPostsPagination(pagenumber, pagesize, bloggerId)
    }

    async findPostsById(id: ObjectId): Promise<PostsResponseType | null> {

        const post: PostsType | null = await this.postsRepositories.findPostsById(new ObjectId(id))

        if (post) {

            return this.postsHelper.makePostResponse(post);
        }
        return null;


    }

    async createPost(title: string, shortDescription: string, content: string, bloggerId: ObjectId): Promise<PostsResponseType | null> {
        const makedPost = await this.postsHelper.makePost(title, shortDescription, content, bloggerId)

        if (makedPost) {
            const post: PostsType = await this.postsRepositories.createPost(makedPost)


            return this.postsHelper.makePostResponse(post)
        }

        return null
    }

    async updatePost(id: ObjectId,
                     title: string,
                     shortDescription: string,
                     content: string,
                     bloggerId: ObjectId): Promise<boolean | null> {


        let blogger: BloggerResponseType | null = await this.bloggersRepositories.findBloggersById(bloggerId)


        if (blogger) {
            return await this.postsRepositories.updatePost(id, title, shortDescription, content, bloggerId, blogger.name)
        }


        return false

    }


    async deletePost(id: ObjectId): Promise<boolean> {

        const isDeleted = await this.postsRepositories.deletePost(id)
        if (isDeleted) {
            return await this.commentHelper.deleteCommentsByPost(id)
        }
        return false


    }


    async createCommentsByPost(postid: ObjectId, content: string, userid: ObjectId, userLogin: string): Promise<NewCommentType | null> {
        let post = await this.findPostsById(postid)

        if (post) {
            let newComment: NewCommentType | null = await this.commentHelper.createComment(postid, content, userid, userLogin)
            return newComment
        }
        return null

    }

    async sendAllCommentsByPostId(postid: ObjectId, pagenumber: number, pagesize: number): Promise<CommentsResponseTypeWithPagination | null> {
        let post: PostsResponseType | null = await this.findPostsById(postid)

        if (post) {
            let allComments: CommentsResponseTypeWithPagination = await this.commentHelper.sendAllComments(new ObjectId(postid), pagenumber, pagesize)
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




    }
}

