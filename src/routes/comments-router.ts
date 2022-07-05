import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {authMidlewares, authMidlewaresWithChekOwn} from "../midlewares/auth-midlewares";


import {commentValidation, inputValidationComment} from "../midlewares/input-validation-comments";
import {CommentResponseType} from "../types/commnet-type";

export const commentsRouter = Router({})

commentsRouter.put('/:id',
    authMidlewares,
    authMidlewaresWithChekOwn,
    commentValidation,
    inputValidationComment,


    async (req: Request, res: Response) => {
        const isUpdated: boolean = await commentsService.updateCommentById(req.params.id, req.body.content)
        if (isUpdated) {
            res.status(204).json(isUpdated)
            return
        }

        res.sendStatus(404)


    });
commentsRouter.delete('/:id', authMidlewares, authMidlewaresWithChekOwn, async (req: Request, res: Response) => {
    const isDeleted: boolean = await commentsService.deleteCommentsById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
        return
    }

    res.sendStatus(404)


});
commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment: CommentResponseType | null = await commentsService.findCommentsById(req.params.id)

    if (!comment) {
        res.sendStatus(404)
        return
    }

    res.send(comment)

});