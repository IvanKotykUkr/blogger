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
import {
    antiDosMiddlewares, loginAuthMiddlewares,
    registrationConfirmMiddlewares,
    registrationMiddlewares, registrationResendingMiddlewares
} from "../midlewares/auth-midlewares";

export const authRouter = Router({})


authRouter.post('/login',
    antiDosMiddlewares,
    loginValidation,
    passwordValidation,
    inputValidationAuth,
    loginAuthMiddlewares,
    async (req: Request, res: Response) => {
        const user: UserType |  string = await authService.checkCredentials(req.body.login, req.body.password)
        if(user==="wrong password") {
            res.status(401).json({errorsMessages: [{message: "password  is wrong", field: " password"}]})
            return
        }
        if (user) {
            const token = await jwtService.createJWT(<UserType>user)
            res.status(200).send(token)
            return
        }


    });
authRouter.post('/registration-confirmation',
    antiDosMiddlewares,

    codeValidation,
    inputValidationAuth,
    registrationConfirmMiddlewares,
    async (req: Request, res: Response) => {
        const result: string | boolean = await authService.confirmEmail(req.body.code)

        if (result === "All ok") {
            res.sendStatus(204)
            return
        }


    });

authRouter.post('/registration',
    antiDosMiddlewares,
    registrationMiddlewares,
    emailValidation,
    inputValidationAuth,
    loginValidationUser,

    passwordValidationUser,
    inputValidationUser,
    registrationMiddlewares,
    async (req: Request, res: Response) => {

        const user = await authService.createUserByAuth(req.body.login, req.body.email, req.body.password)

        if (user === "All ok") {
            res.status(204).json({message: "Successfully Registered", status: 204})
            return
        }


    });
authRouter.post('/registration-email-resending',
    antiDosMiddlewares,
    emailValidation,
    inputValidationUser,
    registrationResendingMiddlewares,
    async (req: Request, res: Response) => {

        const user: string | boolean = await authService.resentConfirmationCode(req.body.email)

        if (user === "All ok") {
            res.sendStatus(204)
            return
        }

    });
