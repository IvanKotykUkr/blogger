import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {AnswerType, GameType, GameWithPagination} from "../types/pairQuizGame-type";
import {PairQuizGameHelper} from "./helpers/pairquizgame-helper";
import {FinishGameHelper} from "./helpers/finish-game-helper";

let availableGame = false

@injectable()
export class PairQuizGameService {
    constructor(@inject(PairQuizGameHelper) protected pairQuizGameHelper: PairQuizGameHelper,
                @inject(FinishGameHelper) protected finishGameHelper: FinishGameHelper) {
    }

    async myCurrentGame(player: ObjectId) {
        return this.pairQuizGameHelper.currentGame(player)

    }

    async getGameById(gameId: ObjectId, userId: string) {

        const game = await this.pairQuizGameHelper.findGame(gameId)

        if (!game) {
            return "didnt find game"
        }
        const firstPlayerId = JSON.stringify(game!.firstPlayer.user.id)
        const secondPlayerId = JSON.stringify(game!.secondPlayer!.user.id)
        const userIdString = JSON.stringify(userId)
        if (firstPlayerId !== userIdString && secondPlayerId !== userIdString) {

            return "not participated"
        }
        return game
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


    async sendAnswer(userId: ObjectId, answer: string): Promise<AnswerType | string> {
        const newAnswer = await this.pairQuizGameHelper.createAnswerHelper(userId, answer)
        if (!newAnswer) {
            return "not active game"
        }
        const finishGame = await this.finishGameHelper.finishGame(userId)

        if (finishGame) {
            return "already answered"
        }
        return newAnswer

    }


    async getAllGamesUsers(userid: ObjectId, pageNumber: number, pageSize: number): Promise<GameWithPagination> {
        return this.pairQuizGameHelper.getAllGamesByUserId(userid, pageNumber, pageSize)

    }
}

