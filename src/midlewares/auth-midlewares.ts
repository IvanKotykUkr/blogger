import {NextFunction, Request, Response} from "express";
import {jwtService} from "../aplication/jwt-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comments-service";
import {CommentType, UserFromTokenType, UserType} from "../repositories/db";
import {JwtPayload} from "jsonwebtoken";


export const authMidlewares = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token: string = req.headers.authorization.split(' ')[1]

    const user:UserFromTokenType|null = await jwtService.getUserIdByToken(token)

    if (!user) {
        res.sendStatus(401)
        return
    }


    req.user = await usersService.findUserById(user.userId)

    next()


}
export const authMidlewaresWithChekOwn = async (req: Request, res: Response, next: NextFunction) => {
    const comment: CommentType | null = await commentsService.findCommentsById(req.params.id)

    if (!comment) {
        res.sendStatus(404)
        return
    }

    // @ts-ignore
    if (req.user!.id.toString() !== comment.userId.toString()) {

        res.sendStatus(403)
        return
    }

    next()
}