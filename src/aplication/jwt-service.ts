import jwt from 'jsonwebtoken'


import {settings} from "../settings";

import {UserFromTokenType} from "../types/user-type";
import {injectable} from "inversify";
import "reflect-metadata";

const expired = "expired";

@injectable()
export class JwtService {
    async createAccessToken(id: string): Promise<{ accessToken: string }> {


        const access: string = jwt.sign({userId: id}, settings.ACCESS_JWT_SECRET, {expiresIn: "1h"})

        return {accessToken: access}


    }

    async createRefreshToken(id: string): Promise<string> {

        const refresh: string = jwt.sign({userId: id}, settings.REFRESH_JWT_SECRET, {expiresIn: "2h"})


        return refresh


    }

    getUserIdByAccessToken(token: string): UserFromTokenType | null {
        try {


            // @ts-ignore
            return jwt.verify(token, settings.ACCESS_JWT_SECRET)


        } catch (error) {
            return null
        }

    }

    getUserIdByRefreshToken(token: string): UserFromTokenType | string {
        try {


            // @ts-ignore
            return jwt.verify(token, settings.REFRESH_JWT_SECRET)


        } catch (error) {


            return expired
        }

    }

}