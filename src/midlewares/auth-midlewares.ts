import {NextFunction, Request, Response} from "express";
import {jwtService} from "../aplication/jwt-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comments-service";
import {UserFromTokenType, UserType} from "../types/user-type";
import {CommentResponseType, CommentType} from "../types/commnet-type";
import {accessAttemptsService} from "../domain/access-attempts-service";
import {userRepositories} from "../repositories/user-db-repositories";

const more = "too mach"
const usedEmail = "email is already used"
const loginExist = "login already exist"
const confirmed = "email already confirmed"
const doesntExist = "user email doesnt exist"
const badly = "Som-sing wrong"
const allOk = "All ok"
const codeExist = "code already confirmed"

export const registrationMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const checkEmail: UserType | null = await userRepositories.findLoginOrEmail(req.body.email)
    if (checkEmail !== null) {
        res.status(400).json({errorsMessages: [{message: "email is already used", field: "email"}]})
        return
    }

    const checkLogin: UserType | null = await userRepositories.findLoginOrEmail(req.body.login)
    if (checkLogin != null) {

        res.status(400).json({errorsMessages: [{message: "login already exist", field: "login"}]})
        return
    }
    next()
}
export const loginAuthMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const user: UserType | null = await userRepositories.findLoginOrEmail(req.body.login)
    if (!user) {
        res.status(400).json({errorsMessages: [{message: " login is wrong", field: " login"}]})
        return
    }
    if (!user.emailConfirmation.isConfirmed) {
        res.status(400).json({errorsMessages: [{message: "user not confirmed", field: "user"}]})
        return

    }


    next()
}
export const registrationResendingMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userRepositories.findLoginOrEmail(req.body.email)

    if (!user) {
        res.status(400).json({errorsMessages: [{message: "user email doesnt exist", field: "email"}]})
        return
    }
    if (user.emailConfirmation.isConfirmed === true) {
        res.status(400).json({errorsMessages: [{message: "email already confirmed", field: "email"}]})
        return

    }
    next()
}
export const registrationConfirmMiddlewares = async (req: Request, res: Response, next: NextFunction) => {

    let user: UserType | null = await userRepositories.findUserByCode(req.body.code)

    if (!user) {
        res.status(400).json({errorsMessages: [{message: " code doesnt exist", field: "code"}]})
        return
    }


    if (false !== user.emailConfirmation.isConfirmed) {
        res.status(400).json({errorsMessages: [{message: "code already confirmed", field: "code"}]})
        return

    }

    if (user.emailConfirmation.expirationDate < new Date()) {
        res.status(400).json({errorsMessages: [{message: "code expired", field: "code"}]})
        return
    }
    next()
}

export const antiDosMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
    const checkIp: string = await accessAttemptsService.countAttempts(req.ip, new Date(), req.url)

    if (checkIp == "too mach") {
        res.status(429).json({errorsMessages: [{message: "too mach request", field: "request"}]})

        return
    }

    next()

}

export const authMidlewares = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token: string = req.headers.authorization.split(' ')[1]

    const user: UserFromTokenType | null = await jwtService.getUserIdByToken(token)

    if (!user) {
        res.sendStatus(401)
        return
    }


    req.user = await usersService.findUserById(user.userId)

    if (req.user === null) {
        res.sendStatus(401)
        return
    }
    next()


}
export const authMidlewaresWithChekOwn = async (req: Request, res: Response, next: NextFunction) => {
    const comment: CommentResponseType | null = await commentsService.findCommentsById(req.params.id)

    if (!comment) {
        res.sendStatus(404)
        return
    }

    if (req.user!.id.toString() !== comment.userId!.toString()) {

        res.sendStatus(403)
        return
    }

    next()
}