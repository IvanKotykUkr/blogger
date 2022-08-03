import {NextFunction, Request, Response} from "express";
import {CommentResponseType} from "../types/commnet-type";

import {UserFromTokenType} from "../types/user-type";

import {container} from "../composition-root";
import {CommentsService} from "../domain/comments-service";
import {JwtService} from "../aplication/jwt-service";
import {UsersService} from "../domain/users-service";
import {TokenService} from "../domain/token-service";
import {ObjectId} from "mongodb";

const commentsService = container.resolve(CommentsService)
const jwtService = container.resolve(JwtService)
const usersService = container.resolve(UsersService)
const tokenService = container.resolve(TokenService)

export const authValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(401).json({
            errorsMessages: [{
                message: "there are no authorizations in the header ",
                field: "headers authorization"
            }]
        })
        return
    }
    const token: string = req.headers.authorization.split(' ')[1]
    const user: UserFromTokenType | null = await jwtService.getUserIdByAccessToken(token)
    if (!user) {
        res.status(401).json({errorsMessages: [{message: "Should be valide JWT Token", field: "token"}]})
        return
    }

    req.user = await usersService.findUserById(user.userId)

    if (req.user === null) {
        res.status(401).json({errorsMessages: [{message: "there is no user", field: "token"}]})
        return
    }
    next()
}
export const authForLikeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
          req.user ={
            id: new ObjectId()
        }
        next()
        return
    }
    const token: string = req.headers.authorization.split(' ')[1]
    const user: UserFromTokenType | null = await jwtService.getUserIdByAccessToken(token)
    if (!user) {
        res.status(401).json({errorsMessages: [{message: "Should be valide JWT Token", field: "token"}]})
        return
    }

    req.user = await usersService.findUserById(user.userId)

    if (req.user === null) {
        res.status(401).json({errorsMessages: [{message: "there is no user", field: "token"}]})
        return
    }

    next()
}
export const authMiddlewaresWithCheckOwn = async (req: Request, res: Response, next: NextFunction) => {
    const comment: CommentResponseType | null = await commentsService.findCommentsById(new ObjectId(req.params.id))
    if (!comment) {
        res.status(404).json({errorsMessages: [{message: "no comment", field: "id"}]})
        return
    }
    if (req.user!.id.toString() !== comment.userId!.toString()) {
        res.sendStatus(403).json({errorsMessages: [{message: "not your own", field: "user"}]})
        return
    }

    next()
}
export const authRefreshTokenMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken


    if (!refreshToken) {
        res.status(401).json({errorsMessages: [{message: "token", field: "cookie"}]})
        return
    }


    const alreadyUsed = await tokenService.checkToken(refreshToken)
    if (alreadyUsed) {
        res.clearCookie("refreshToken")
        res.status(401).json({errorsMessages: [{message: "alreadyUsed", field: "refreshToken"}]})
        return
    }
    // const user:UserFromTokenType=jwtService.decodCode(refreshToken)
    const user: UserFromTokenType | string = jwtService.getUserIdByRefreshToken(refreshToken)
    /* if (Date.now() >= user.exp * 1000) {
         await tokenService.saveTokenInBlacklist(req.headers.cookie)
         console.log('expired log')
         console.log('user', user)
         res.clearCookie("refreshToken")
         res.status(401).json({errorsMessages: [{message: "expired", field: "refreshToken"}]})
         return
     }
      */
    if (user === "expired") {
        await tokenService.saveTokenInBlacklist(refreshToken)


        res.clearCookie("refreshToken")
        res.status(401).json({errorsMessages: [{message: "expired", field: "refreshToken"}]})
        return
    }
    const addToken = await tokenService.saveTokenInBlacklist(refreshToken)
    if (addToken && typeof user !== "string") {
        req.user = await usersService.findUserById(user.userId)
    }
    if (req.user === null) {
        res.status(401).json({errorsMessages: [{message: "there is no user", field: "token"}]})
        return
    }
    next()
}