import {Request, Response, Router} from "express";


import {JwtService} from "../aplication/jwt-service";
import {


    loginValidation,
    passwordValidation,
    inputValidationAuth, codeValidation, emailValidation, refreshTokenValidation, tokenValidationAuth,
} from "../middlewares/input-validation-auth";
import {AuthService} from "../domain/auth-service";

import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../middlewares/input-validation-users";
import {
    antiDosMiddlewares, loginAuthMiddlewares,
    registrationConfirmMiddlewares,
    registrationMiddlewares, registrationResendingMiddlewares
} from "../middlewares/auth-validation-middleware";
import {authRefreshTokenMiddlewares, authValidationMiddleware} from "../middlewares/auth-access-middlewares";
import {TokenService} from "../domain/token-service";


export const authRouter = Router({})

class AuthController {
    jwtService: JwtService
    authService: AuthService
    tokenService: TokenService

    constructor() {
        this.jwtService = new JwtService()
        this.authService = new AuthService()
        this.tokenService = new TokenService()

    }

    resToken(accessToken: { accessToken: string }, refreshToken: string, res: Response) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: true,
        });

        return res.status(200).send(accessToken)
    }

    async login(req: Request, res: Response) {
        const userId: string = await this.authService.checkCredentials(req.body.login, req.body.password)
        if (userId === "wrong password") {
            res.status(401).json({errorsMessages: [{message: "password  is wrong", field: " password"}]})
            return
        }


        const accessToken = await this.jwtService.createAccessToken(userId)
        const refreshToken = await this.jwtService.createRefreshToken(userId)
        this.resToken(accessToken, refreshToken, res)


    }

    async refreshToken(req: Request, res: Response) {
        const accessToken = await this.jwtService.createAccessToken(req.user.id)
        const refreshToken = await this.jwtService.createRefreshToken(req.user.id)
        this.resToken(accessToken, refreshToken, res)

    }

    async logout(req: Request, res: Response) {


        const token = await this.tokenService.saveTokenInBlacklist(req.cookies.refreshToken)
        if (token) {
            res.clearCookie("refreshToken")
            res.sendStatus(204)
            return
        }


    }

    async registrationConfirmation(req: Request, res: Response) {
        const result: string | boolean = await this.authService.confirmEmail(req.body.code)

        if (result === "All ok") {
            res.sendStatus(204)
            return
        }


    }

    async registration(req: Request, res: Response) {
        const proces = ""
        const user = await this.authService.createUser(req.body.login, req.body.email, req.body.password, proces)

        if (user === "All ok") {
            res.status(204).json({message: "Successfully Registered", status: 204})
            return
        }


    }

    async registrationEmailResending(req: Request, res: Response) {

        const user: string | boolean = await this.authService.resentConfirmationCode(req.body.email)

        if (user === "All ok") {
            res.sendStatus(204)
            return
        }

    }

    async me(req: Request, res: Response) {

        res.status(200).json({
            "email": req.user.email,
            "login": req.user.login,
            "userId": req.user.id
        })

    }
}

const authController = new AuthController()


authRouter.post('/login',
    antiDosMiddlewares,
    loginValidation,
    passwordValidation,
    inputValidationAuth,
    loginAuthMiddlewares,
    authController.login.bind(authController));
authRouter.post('/refresh-token',
    authRefreshTokenMiddlewares,
    authController.refreshToken.bind(authController));
authRouter.post('/logout',

    authRefreshTokenMiddlewares,
    authController.logout.bind(authController));
authRouter.post('/registration-confirmation',
    antiDosMiddlewares,

    codeValidation,
    inputValidationAuth,
    registrationConfirmMiddlewares,
    authController.registrationConfirmation.bind(authController));

authRouter.post('/registration',
    antiDosMiddlewares,
    registrationMiddlewares,
    emailValidation,
    inputValidationAuth,
    loginValidationUser,

    passwordValidationUser,
    inputValidationUser,

    authController.registration.bind(authController));
authRouter.post('/registration-email-resending',
    antiDosMiddlewares,
    emailValidation,
    inputValidationUser,
    registrationResendingMiddlewares,
    authController.registrationEmailResending.bind(authController));
authRouter.get('/me', authValidationMiddleware, authController.me.bind(authController));