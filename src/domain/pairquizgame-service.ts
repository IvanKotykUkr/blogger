import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {GameType} from "../types/pairQuizGame-type";
import {PairQuizGameHelper} from "./helpers/pairquizgame-helper";

let availableGame = false

@injectable()
export class PairQuizGameService {
    constructor(@inject(PairQuizGameHelper) protected pairQuizGameHelper: PairQuizGameHelper) {
    }

    async connectGame(userId: ObjectId, login: string): Promise<GameType> {
        if (availableGame) {
            const game = await this.pairQuizGameHelper.connectToGame(userId, login)
            availableGame = false
            return game
        }
        const game = await this.pairQuizGameHelper.createGame(userId, login)
        availableGame = true
        return game
    }
}

