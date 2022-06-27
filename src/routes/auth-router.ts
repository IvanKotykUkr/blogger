import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../aplication/jwt-service";
import {inputValidationAuth, loginValidation, passwordValidation} from "../midlewares/input-validation-auth";

export const authRouter = Router({})


authRouter.post('/login',
    loginValidation,
    passwordValidation,
    inputValidationAuth
    ,async (req:Request, res:Response)=>{
    const user = await usersService.chekCredentials(req.body.login,req.body.password)
    console.log(user)
    if(user){
        const token = await jwtService.createJWT(user)
        res.status(200).send(token)
    }else {
        res.sendStatus(401)
    }




});