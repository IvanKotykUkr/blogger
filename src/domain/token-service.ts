import {TokenRepositories} from "../repositories/token-db-repositories";

export class TokenService {
    tokenRepositories: TokenRepositories

    constructor() {
        this.tokenRepositories = new TokenRepositories()
    }

    ///save to repo
    async saveTokenInBlacklist(token: string) {

        const result = await this.tokenRepositories.addTokenInBlacklist(token)

        return result

    }

    ///check from repo

    async checkToken(refreshToken: string) {
        const result = await this.tokenRepositories.checkTokenInBlacklist(refreshToken)

        return result

    }

}
