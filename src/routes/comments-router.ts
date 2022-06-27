import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {authMidlewares, authMidlewaresWithChekOwn} from "../midlewares/auth-midlewares";
import {usersRouter} from "./users-router";
import {usersService} from "../domain/users-service";

export const commentsRouter= Router({})

commentsRouter.put('/:id',authMidlewaresWithChekOwn, async (req:Request, res:Response)=>{
    const isUpdated = await commentsService.updateCommentById(req.params.id,req.body.content)
    if(isUpdated){

        res.status(204).json(isUpdated)

    }else {

        res.sendStatus(404)
    }

});
commentsRouter.delete('/:id', authMidlewaresWithChekOwn,async (req:Request, res:Response)=>{
    const isDeleted = await commentsService.deleteCommentsById(+req.params.id)
    if ( isDeleted) res.sendStatus(204)

});
commentsRouter.get('/:id', async (req:Request, res:Response)=>{
    const comment = await commentsService.getCommentsById(+req.params.id)

        if(!comment){
        res.sendStatus(404)
    }else {

        res.send(comment)
    }
});