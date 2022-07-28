import {NextFunction, Request, Response} from "express";
import {CommentResponseType} from "../types/commnet-type";
import {CommentsService} from "../domain/comments-service";
import {UserFromTokenType} from "../types/user-type";
import {JwtService} from "../aplication/jwt-service";
import {UsersService} from "../domain/users-service";
import {TokenService} from "../domain/token-service";

class AuthAccessMiddlewares {
    commentsService: CommentsService
    jwtService: JwtService
    usersService: UsersService
    tokenService: TokenService

    constructor() {
        this.commentsService = new CommentsService()
        this.jwtService = new JwtService()
        this.usersService = new UsersService()
        this.tokenService = new TokenService()
    }

    async authValidationMiddleware(req: Request, res: Response, next: NextFunction) {
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

        const user: UserFromTokenType | null = await this.jwtService.getUserIdByAccessToken(token)
        if (!user) {
            res.status(401).json({errorsMessages: [{message: "Should be valide JWT Token", field: "token"}]})
            return
        }


        req.user = await this.usersService.findUserById(user.userId)


        if (req.user === null) {
            res.status(401).json({errorsMessages: [{message: "there is no user", field: "token"}]})
            return
        }
        next()


    }

    async authMiddlewaresWithCheckOwn(req: Request, res: Response, next: NextFunction) {
        const comment: CommentResponseType | null = await this.commentsService.findCommentsById(req.params.id)

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

    async authRefreshTokenMiddlewares(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            res.status(401).json({errorsMessages: [{message: "token", field: "cookie"}]})
            return
        }


        const alreadyUsed = await this.tokenService.checkToken(refreshToken)
        if (alreadyUsed === true) {
            res.clearCookie("refreshToken")
            res.status(401).json({errorsMessages: [{message: "alreadyUsed", field: "refreshToken"}]})
            return
        }
// const user:UserFromTokenType=jwtService.decodCode(refreshToken)
        const user: UserFromTokenType | string = this.jwtService.getUserIdByRefreshToken(refreshToken)

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
            await this.tokenService.saveTokenInBlacklist(refreshToken)
            res.clearCookie("refreshToken")
            res.status(401).json({errorsMessages: [{message: "expired", field: "refreshToken"}]})
            return
        }


        const addToken = await this.tokenService.saveTokenInBlacklist(refreshToken)
        if (addToken && typeof user !== "string") {

            req.user = await this.usersService.findUserById(user.userId)

        }
        if (req.user === null) {
            res.status(401).json({errorsMessages: [{message: "there is no user", field: "token"}]})
            return
        }


        next()
    }

}

const authAccessMiddlewares = new AuthAccessMiddlewares()
export const authValidationMiddleware = authAccessMiddlewares.authValidationMiddleware.bind(authAccessMiddlewares)
export const authMiddlewaresWithCheckOwn = authAccessMiddlewares.authMiddlewaresWithCheckOwn.bind(authAccessMiddlewares)
export const authRefreshTokenMiddlewares = authAccessMiddlewares.authRefreshTokenMiddlewares.bind(authAccessMiddlewares)
