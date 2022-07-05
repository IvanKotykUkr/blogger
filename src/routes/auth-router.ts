import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../aplication/jwt-service";
import {inputValidationAuth, loginValidation, passwordValidation} from "../midlewares/input-validation-auth";
import {UserType} from "../types/user-type";

export const authRouter = Router({})


authRouter.post('/login',
    loginValidation,
    passwordValidation,
    inputValidationAuth,
    async (req: Request, res: Response) => {
        const user: UserType | boolean = await usersService.checkCredentials(req.body.login, req.body.password)

        if (user) {
            const token = await jwtService.createJWT(<UserType>user)
            res.status(200).send(token)
            return
        }
        res.sendStatus(401)


    });