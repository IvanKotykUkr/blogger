import {NextFunction,Request,Response} from "express";
import {jwtService} from "../aplication/jwt-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comments-service";

export const authMidlewares = async (req:Request,res:Response,next:NextFunction)=>{
    if(!req.headers.authorization){
        res.send(400)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const user= await jwtService.getUserIdByToken(token)

    if (!user){
        res.send(401)

    }else {
        const userid = await user.userId
        req.user= await usersService.findUserById(userid)

        next()
    }



}
export const authMidlewaresWithChekOwn= async (req:Request,res:Response,next:NextFunction)=>{

    if(!req.headers.authorization){
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const user= await jwtService.getUserIdByToken(token)





    if (user){


        const userid = await user.userId

        const comment= await commentsService.getCommentsById(req.params.id)
        if(comment){
            // @ts-ignore
            if (comment.userid !== userid) {
                res.sendStatus(403)

            } else {
                req.user = await usersService.findUserById(userid)
                next()
            }
        }else {
            res.send(404)
        }

    }else {
        res.send(401)
    }

}