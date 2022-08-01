import {JwtService} from "../aplication/jwt-service";
import {AuthService} from "../domain/auth-service";
import {TokenService} from "../domain/token-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class AuthController {


    constructor(@inject(JwtService) protected jwtService: JwtService,
                @inject(AuthService) protected authService: AuthService,
                @inject(TokenService) protected tokenService: TokenService) {


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
        const user = await this.authService.createUser(req.body.login, req.body.email, req.body.password)

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