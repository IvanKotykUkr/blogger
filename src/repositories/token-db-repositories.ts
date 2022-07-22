import {tokenCollection} from "./db";

export const tokenRepositories = {

    async addTokenInBlacklist(token: string) {
        const result = await tokenCollection.insertOne({token})
        return result
    },
    async checkTokenInBlacklist(refreshToken: string) {
        const result = await tokenCollection.findOne({token: refreshToken})
        if (result) {
            return true
        }
        return false


    }
}