import {Request, Response, Router} from "express";
import {CommentsService} from "../domain/comments-service";


import {commentValidation, inputValidationComment} from "../middlewares/input-validation-comments";
import {CommentResponseType} from "../types/commnet-type";
import {authMiddlewaresWithCheckOwn, authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {idValidationMiddleware} from "../middlewares/_id-validation-middleware";

export const commentsRouter = Router({})

class CommentController {
    commentsService: CommentsService

    constructor() {
        this.commentsService = new CommentsService()
    }

    async updateComment(req: Request, res: Response) {

        const isUpdated: boolean = await this.commentsService.updateCommentById(req.params.id, req.body.content)
        if (isUpdated) {
            res.status(204).json(isUpdated)
            return
        }

        res.sendStatus(404)


    }

    async deleteComment(req: Request, res: Response) {
        const isDeleted: boolean = await this.commentsService.deleteCommentsById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(404)


    }

    async getComment(req: Request, res: Response) {
        const comment: CommentResponseType | null = await this.commentsService.findCommentsById(req.params.id)

        if (!comment) {
            res.sendStatus(404)
            return
        }

        res.send(comment)

    }

}

const commentsController = new CommentController()

commentsRouter.put('/:id',
    idValidationMiddleware,
    authValidationMiddleware,
    authMiddlewaresWithCheckOwn,
    commentValidation,
    inputValidationComment,


    commentsController.updateComment.bind(commentsController));
commentsRouter.delete('/:id',
    idValidationMiddleware,
    authValidationMiddleware,
    authMiddlewaresWithCheckOwn,
    commentsController.deleteComment.bind(commentsController));
commentsRouter.get('/:id',
    idValidationMiddleware,
    commentsController.getComment.bind(commentsController));