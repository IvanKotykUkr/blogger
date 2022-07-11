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
        const user: UserType | boolean = await authService.checkCredentials(req.body.login, req.body.password)

        if (user) {
            const token = await jwtService.createJWT(<UserType>user)
            res.status(200).send(token)
            return
        }
        res.sendStatus(401)


    });
authRouter.post('/registration-confirmation',
    codeValidation
    ,inputValidationAuth,
    async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)
    if(result){
        res.sendStatus(201)
        return
    }
    res.sendStatus(400)

});

authRouter.post('/registration',
    loginValidationUser,
    emailValidation,
    passwordValidationUser,
    inputValidationUser,
    async (req: Request, res: Response) => {

    const user = await authService.createUserByAuth(req.body.login, req.body.email, req.body.password,req.ip)
    if(user===false){
        res.sendStatus(429)
    }
    if (user){
        res.sendStatus(204)
        return
    }

    res.sendStatus(400)
});
authRouter.post('/registration-confirmation-email-resending',
    emailValidation,
    inputValidationUser,
    async (req: Request, res: Response) => {

    const user = await authService.resentComfirmationCode( req.body.email,req.ip)

    /*if(user===false){
        res.sendStatus(429)
    }*/
    if (user){
        res.sendStatus(204)
        return
    }

    res.sendStatus(400)

});
