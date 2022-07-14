import {Request, Response, Router} from "express";


import {jwtService} from "../aplication/jwt-service";
import {


    loginValidation,
    passwordValidation,
    inputValidationAuth, codeValidation, emailValidation,
} from "../midlewares/input-validation-auth";
import {UserType} from "../types/user-type";
import {authService} from "../domain/auth-service";
import {emailManager} from "../managers/email-manager";
import {inputValidationUser, loginValidationUser, passwordValidationUser} from "../midlewares/input-validation-users";

export const authRouter = Router({})


authRouter.post('/login',
    loginValidation,
    passwordValidation,
    inputValidationAuth,
    async (req: Request, res: Response) => {
        const user: UserType | boolean | string = await authService.checkCredentials(req.body.login, req.body.password, req.ip)
        if (user === "too mach") {
            res.status(429).json("too mach")
            return
        }

        if (user) {
            const token = await jwtService.createJWT(<UserType>user)
            res.status(200).send(token)
            return
        }
        res.sendStatus(401)


    });
authRouter.post('/registration-confirmation',
    codeValidation,
    inputValidationAuth,
    async (req: Request, res: Response) => {
        const result:string|boolean = await authService.confirmEmail(req.body.code, req.ip)
        if (result === "too mach") {
            res.status(429).json("too mach")
            return
        }
        if (result==="All ok") {
            res.sendStatus(204)
            return
        }
        if(result==="code already confirmed"){
            res.status(400).json({errorsMessages: [{message: "code already confirmed", field: "code"}]})
            return
        }


    });

authRouter.post('/registration',
    emailValidation,
    inputValidationAuth,
    loginValidationUser,

    passwordValidationUser,
    inputValidationUser,
    async (req: Request, res: Response) => {

        const user = await authService.createUserByAuth(req.body.login, req.body.email, req.body.password, req.ip)
        if (user === "too mach") {
            res.status(429).json("too mach")
            return
        }
        if (user === "All ok") {
            res.status(204).json({message: "Successfully Registered", status: 204})
            return
        }
        if (user === "login already exist") {
            res.status(400).json({errorsMessages: [{message: "login already exist", field: "login"}]})
            return
        }
        if (user === "email is already used") {
            res.status(400).json({errorsMessages: [{message: "email is already used", field: "email"}]})
            return
        }


    });
authRouter.post('/registration-email-resending',
    emailValidation,
    inputValidationUser,
    async (req: Request, res: Response) => {

        const user = await authService.resentConfirmationCode(req.body.email, req.ip)
        if (user === "too mach") {
            res.status(429).json("too mach")
            return
        }
        if (user === "All ok") {
            res.sendStatus(204)
            return
        }
        if (user === "email already confirmed") {
            res.status(400).json({errorsMessages: [{message: "email already confirmed", field: "email"}]})
            return
        }
        if (user === "user email doesnt exist") {
            res.status(400).json({errorsMessages: [{message: "user email doesnt exist", field: "email"}]})
            return
        }
    });
