import jwt from 'jsonwebtoken'


import {settings} from "../settings";
import {ObjectId} from "mongodb";
import {UserFromTokenType, UserType} from "../types/user-type";
import {refreshTokenValidation} from "../middlewares/input-validation-auth";

export const jwtService = {
    async createAccessToken(id:string): Promise<{ accesstoken: string }> {


        const access: string = jwt.sign({userId: id}, settings.ACCESS_JWT_SECRET, {expiresIn: "10s"})

        return {accesstoken: access}


    },
    async createRefreshToken(id:string): Promise<string> {

        const refresh: string = jwt.sign({userId: id}, settings.REFRESH_JWT_SECRET, {expiresIn: "20s"})


        return refresh


    },
    async getUserIdByAccessToken(token: string): Promise<UserFromTokenType | null> {
        try {


            // @ts-ignore
            return jwt.verify(token, settings.ACCESS_JWT_SECRET)


        } catch (error) {
            return null
        }

    },
    async getUserIdByRefreshToken(token: string): Promise<UserFromTokenType | null> {
        try {

            //@ts-ignore
            return await jwt.verify(token, settings.REFRESH_JWT_SECRET)


        } catch (error) {
            return null
        }

    },

}