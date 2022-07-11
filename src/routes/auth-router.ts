import {Request, Response, Router} from "express";


import {jwtService} from "../aplication/jwt-service";
import {

    inputValidationAuth,
    loginValidation,
    passwordValidation
} from "../midlewares/input-validation-auth";
import {UserType} from "../types/user-type";
import {authService} from "../domain/auth-service";

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
authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)
    if(result){
        res.sendStatus(201)
        return
    }
    res.sendStatus(400)

});

authRouter.post('/registration', async (req: Request, res: Response) => {
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
authRouter.post('/registration-confirmation-email-resending', async (req: Request, res: Response) => {
    const user = await authService.resentComfirmationCode( req.body.email,req.ip)
    if(user===false){
        res.sendStatus(429)
    }
    if (user){
        res.sendStatus(204)
        return
    }

    res.sendStatus(400)

});
