import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {CommentResponseType} from "../types/commnet-type";
import {inject, injectable} from "inversify";
import "reflect-metadata";
@injectable()
export class CommentController {


    constructor(@inject(CommentsService)protected commentsService: CommentsService) {

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