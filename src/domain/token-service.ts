import {tokenRepositories} from "../repositories/token-db-repositories";

export const tokenService={
    ///save to repo
    async saveTokenInBlacklist(token: string ) {

       const result = await tokenRepositories.addTokenInBlacklist(token)

        return result

    },

    ///check from repo

    async checkToken(refreshToken: string) {
        const result = await tokenRepositories.checkTokenInBlacklist(refreshToken)

        return result

    }
}