import {TokensModelClass} from "./db";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class TokenRepositories {
    async addTokenInBlacklist(token: string) {
        const tokenInstance = new TokensModelClass

        tokenInstance.token = token
        tokenInstance.addedAt = Date.now()
        await tokenInstance.save()
        return tokenInstance.token
    }

    async checkTokenInBlacklist(token: string) {

        const result = await TokensModelClass.findOne({token})
        if (result) {
            return true
        }
        return false


    }

}
