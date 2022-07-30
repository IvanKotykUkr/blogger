import {TokenRepositories} from "../repositories/token-db-repositories";
import {inject, injectable} from "inversify";
import "reflect-metadata";
@injectable()
export class TokenService {


    constructor(@inject(TokenRepositories)protected tokenRepositories: TokenRepositories) {

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
