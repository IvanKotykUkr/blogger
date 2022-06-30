import {NextFunction, Request, Response} from "express";
import {jwtService} from "../aplication/jwt-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comments-service";


export const authMidlewares = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const user = await jwtService.getUserIdByToken(token)

    if (!user) {
        res.sendStatus(401)
        return
    }

    const userid = await user.userId
    req.user = await usersService.findUserById(userid)

    next()


}
export const authMidlewaresWithChekOwn = async (req: Request, res: Response, next: NextFunction) => {
    const comment = await commentsService.getCommentsById(req.params.id)

    if (!comment) {
        res.sendStatus(404)
        return
    }

    if (comment.userId !== req.user.id) {
        res.sendStatus(403)
        return
    }

    next()
}