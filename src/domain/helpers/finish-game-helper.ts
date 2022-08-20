import {inject, injectable} from "inversify";
import {ScoreGameRepositories} from "../../repositories/score-game-repositories";
import {ObjectId} from "mongodb";
import {
    ResponseScoreType,
    TopRatingType,
    TotalGameScoreWithUser,
    winnerOrLoserType
} from "../../types/pairQuizGame-type";
import {GameRepositories} from "../../repositories/game-db-repositories";


let winnerOrLoser: winnerOrLoserType

@injectable()
export class FinishGameHelper {
    constructor(@inject(GameRepositories) protected gameRepositories: GameRepositories,
                @inject(ScoreGameRepositories) protected scoreGameRepositories: ScoreGameRepositories) {
    }

    async finishGame(userId: ObjectId): Promise<boolean> {
        const checkGameFinish = await this.gameRepositories.checkGameFinishDb(userId)

        if (checkGameFinish) {
            await this.addFinishScore(checkGameFinish)
            return true
        }

        return false

    }

    async addFinishScore(resultGame: TotalGameScoreWithUser): Promise<boolean> {
        const firstPlayer = resultGame.firstPlayer
        const secondPlayer = resultGame.secondPlayer
        if (firstPlayer.score > secondPlayer.score) {
            await this.addWinnerPlayer(firstPlayer)
            await this.addLoserPlayer(secondPlayer)
        }
        await this.addWinnerPlayer(secondPlayer)
        await this.addLoserPlayer(firstPlayer)

        return true
    }

    async addWinnerPlayer(player: ResponseScoreType): Promise<TopRatingType> {
        winnerOrLoser = {
            user: player.user,
            score: player.score
        }
        return this.scoreGameRepositories.addWinner(winnerOrLoser)

    }

    async addLoserPlayer(player: ResponseScoreType): Promise<TopRatingType> {
        winnerOrLoser = {
            user: player.user,
            score: player.score
        }
        return this.scoreGameRepositories.addLoser(winnerOrLoser)

    }
}