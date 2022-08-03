import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";
import {CommentsResponseTypeWithPagination, NewCommentType} from "../types/commnet-type";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {ObjectId} from "mongodb";

@injectable()
export class PostsController {


    constructor(@inject(PostsService) protected postsService: PostsService) {

    }

    async getPost(req: Request, res: Response) {
        console.log("new   "+req.user)
        const post: PostsResponseType | null = await this.postsService.findPostById(new ObjectId(req.params.id),
          new ObjectId(  req.user.id))

        if (!post) {
            res.sendStatus(404)
            return
        }

        res.send(post)


    }

    async getPosts(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        const posts: PostsResponseTypeWithPagination = await this.postsService.findPosts(+pagenumber, +pagesize, new ObjectId(  req.user.id))
        res.status(200).send(posts)
    }

    async createPost(req: Request, res: Response) {
        const newPost: PostsResponseType | null = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
           new ObjectId(req.body.bloggerId))
        if (newPost) {
            res.status(201).send(newPost)
            return
        }
        res.status(400).json({
            errorsMessages:
                [{
                    message: "Invalid value",
                    field: "bloggerId"
                }]
        })


    }

    async updatePost(req: Request, res: Response) {
        const isUpdated: boolean | null = await this.postsService.updatePost(
            new ObjectId(req.params.id),
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)


        if (isUpdated) {
            res.status(204).json(isUpdated)
            return
        }
        if (isUpdated === null) {
            res.status(400).json({
                errorsMessages:
                    [{
                        message: "Invalid value",
                        field: "bloggerId"
                    }]
            })
            return
        }
        res.send(404)


    }

    async deletePosts(req: Request, res: Response) {
        const isDeleted: boolean = await this.postsService.deletePost(new ObjectId(req.params.id))

        if (isDeleted) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(404)


    }

    async createComment(req: Request, res: Response) {


        const newComment: NewCommentType | null = await this.postsService.createCommentsByPost(new ObjectId(req.params.id), req.body.content, new ObjectId(req.user!.id), req.user!.login)

        if (!newComment) {
            res.send(404)
            return
        }
        res.status(201).send(newComment)


    }

    async getComment(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        const allComment: CommentsResponseTypeWithPagination | null = await this.postsService.sendAllCommentsByPostId(new ObjectId(req.params.id), +pagenumber, +pagesize ,new ObjectId(  req.user.id))
        if (!allComment) {
            res.send(404)
            return
        }
        res.status(200).send(allComment)


    }

    async updateLikeStatus(req: Request, res: Response) {
        const isUpdated = await this.postsService.updateLikeStatus(req.body.likeStatus, new ObjectId(req.params.id), new ObjectId(req.user.id), req.user.login)
        if (isUpdated) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(404)

    }
}