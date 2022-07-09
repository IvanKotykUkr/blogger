import jwt from 'jsonwebtoken'


import {settings} from "../settings";
import {ObjectId} from "mongodb";
import { UserFromTokenType, UserType} from "../types/user-type";

export const jwtService = {
    async createJWT(user: UserType): Promise<{ token: string }> {

        const token: string = jwt.sign({userId: new ObjectId(user._id)}, settings.JWT_SECRET, {expiresIn: '1h'})

        return {token: token}


    },
    async getUserIdByToken(token: string): Promise<UserFromTokenType | null> {
        try {



            // @ts-ignore
            return await jwt.verify(token, settings.JWT_SECRET)


        } catch (error) {
            return null
        }

    }
}