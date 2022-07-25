import {Request, Response, Router} from "express";
import {PostsService} from "../domain/posts-service";
import {
    bloggerIdtValidation,
    contentValidation, inputValidationPost,
    shortDescriptionValidation,
    titleValidation,
} from "../middlewares/input-validation-midlewares-posts";
import {basicAuthorization} from "../middlewares/basicAuth";
import {commentValidation, inputValidationComment} from "../middlewares/input-validation-comments";
import {PostsResponseType, PostsResponseTypeWithPagination} from "../types/posts-type";
import {CommentResponseType, CommentsResponseTypeWithPagination} from "../types/commnet-type";
import {authMiddlewaresWithCheckOwn, authValidationMiddleware} from "../middlewares/auth-access-middlewares";


export const postsRouter = Router({})

class PostsController {
    postsService: PostsService

    constructor() {
        this.postsService = new PostsService()
    }

    async getPost(req: Request, res: Response) {
        const post: PostsResponseType | null = await this.postsService.findPostsById(req.params.id)
        if (!post) {
            res.sendStatus(404)
            return
        }

        res.send(post)


    }

    async getPosts(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        const posts: PostsResponseTypeWithPagination = await this.postsService.findPosts(+pagenumber, +pagesize)
        res.status(200).send(posts)
    }

    async createPost(req: Request, res: Response) {
        const newPost: PostsResponseType | null = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.bloggerId)
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
            req.params.id,
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
        const isDeleted: boolean = await this.postsService.deletePost(req.params.id)

        if (isDeleted) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(404)


    }

    async createComment(req: Request, res: Response) {


        const newComment: CommentResponseType | null = await this.postsService.createCommentsByPost(req.params.id, req.body.content, "" + req.user!.id, req.user!.login)

        if (!newComment) {
            res.send(404)
            return
        }
        res.status(201).send(newComment)


    }

    async getComment(req: Request, res: Response) {
        const pagenumber = req.query.PageNumber || 1;
        const pagesize = req.query.PageSize || 10;
        const allComment: CommentsResponseTypeWithPagination | null = await this.postsService.sendAllCommentsByPostId(req.params.id, +pagenumber, +pagesize)
        if (!allComment) {
            res.send(404)
            return
        }
        res.status(200).send(allComment)


    }
}

const postsController = new PostsController()

postsRouter.get("/:id", postsController.getPost.bind(postsController));

postsRouter.get("/", postsController.getPosts.bind(postsController));


postsRouter.post("/",

    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

    postsController.createPost.bind(postsController));

postsRouter.put("/:id",
    basicAuthorization,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    bloggerIdtValidation,
    inputValidationPost,

    postsController.updatePost.bind(postsController));

postsRouter.delete("/:id", basicAuthorization, postsController.deletePosts.bind(postsController));
postsRouter.post('/:id/comments',
    authValidationMiddleware,
    commentValidation,
    inputValidationComment,

    postsController.createComment.bind(postsController));
postsRouter.get('/:id/comments', postsController.getComment.bind(postsController));




