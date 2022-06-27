import jwt from 'jsonwebtoken'
import {UserDBtype} from "../repositories/types";
import {ObjectId} from "mongodb";
import {settings} from "../settings";

export const jwtService={
    async createJWT(user:UserDBtype|any) {

        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
        return {token:token}


    },
    async getUserIdByToken(token:string){
        try {
            const result : any = jwt.verify(token,settings.JWT_SECRET)
            return result
        }catch (error){
            return null
        }

    }
}