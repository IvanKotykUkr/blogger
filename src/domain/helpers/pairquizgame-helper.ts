import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {GameRepositories} from "../../repositories/game-db-repositories";
import {GameType, PlayerType} from "../../types/pairQuizGame-type";

@injectable()
export class PairQuizGameHelper {
    constructor(@inject(GameRepositories) protected gameRepositories: GameRepositories) {
    }

    makeUser(userid: ObjectId, login: string) {
        return {
            user: {
                _id: userid,
                login
            },
            score: 0
        }

    }

    async createGame(userId: ObjectId, login: string): Promise<GameType> {
        const newPlayer: PlayerType = this.makeUser(userId, login)
        const game = await this.gameRepositories.startNewGame(newPlayer)
        return game

    }

    async connectToGame(userId: ObjectId, login: string): Promise<GameType> {
        const newPlayer: PlayerType = this.makeUser(userId, login)
        const game = await this.gameRepositories.connectToNewGame(newPlayer)
        if (!game) {
            return this.createGame(newPlayer.user._id, newPlayer.user.login)
        }
        return game

    }


}