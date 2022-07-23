import { TokensModelClass} from "./db";

export const tokenRepositories = {

    async addTokenInBlacklist(token: string) {
        const tokenInstance = new TokensModelClass
        tokenInstance.token=token
        await tokenInstance.save()
        return tokenInstance
    },
    async checkTokenInBlacklist(token: string) {

        const result = await TokensModelClass.findOne({token})
        if (result) {
            return true
        }
        return false


    }
}