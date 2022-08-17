import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {GameRepositories} from "../../repositories/game-db-repositories";
import {
    AnswerType,
    FindPlayerDbType,
    GamePlayerType,
    GameType,
    QuestionsType,
    TotalGameScoreWithUser,
    winnerAndLoserType
} from "../../types/pairQuizGame-type";
import {ScoreGameRepositories} from "../../repositories/score-game-repositories";

@injectable()
export class PairQuizGameHelper {
    constructor(@inject(GameRepositories) protected gameRepositories: GameRepositories,
                @inject(ScoreGameRepositories) protected scoreGameRepositories: ScoreGameRepositories) {
    }

    makeUser(userid: ObjectId, login: string): GamePlayerType {
        return {
            answers: [],
            user: {
                _id: userid,
                login
            },
            score: 0
        }

    }

    async createGame(userId: ObjectId, login: string): Promise<GameType> {
        const newPlayer: GamePlayerType = this.makeUser(userId, login)
        return this.gameRepositories.startNewGame(newPlayer)


    }

    async connectToGame(userId: ObjectId, login: string): Promise<GameType> {
        const newPlayer: GamePlayerType = this.makeUser(userId, login)
        const game = await this.gameRepositories.connectToNewGame(newPlayer)
        if (!game) {
            return this.createGame(newPlayer.user._id, newPlayer.user.login)
        }
        return game

    }

    async createAnswerHelper(userId: ObjectId, answer: string): Promise<AnswerType | null> {
        const firstPlayerWithAnswers = await this.findFirsPlayerHelper(userId)
        const secondPlayerWithAnswers = await this.findSecondPlayerHelper(userId)

        if (firstPlayerWithAnswers) {
            return this.addAnswerFirstPlayerDB(firstPlayerWithAnswers, answer)
        }
        if (secondPlayerWithAnswers) {
            return this.addAnswerSecondPlayerDB(secondPlayerWithAnswers, answer)
        }
        return null


    }

    async findFirsPlayerHelper(userId: ObjectId): Promise<FindPlayerDbType | null> {
        return this.gameRepositories.findFirstPlayerDB(userId)
    }

    async findSecondPlayerHelper(userId: ObjectId): Promise<FindPlayerDbType | null> {
        return this.gameRepositories.findSecondPlayerDB(userId)
    }

    async addAnswerFirstPlayerDB(firstPlayerWithAnswers: FindPlayerDbType, answer: string): Promise<AnswerType> {

        const answersDb: AnswerType = this.checkAnswer(firstPlayerWithAnswers.questions, answer)
        await this.gameRepositories.addAnswerForFirstPlayer(firstPlayerWithAnswers.gameId, answersDb)
        return answersDb

    }

    async addAnswerSecondPlayerDB(secondPlayerWithAnswers: FindPlayerDbType, answer: string): Promise<AnswerType> {
        const answersDb: AnswerType = this.checkAnswer(secondPlayerWithAnswers.questions, answer)
        await this.gameRepositories.addAnswerForSecondPlayer(secondPlayerWithAnswers.gameId, answersDb)
        return answersDb

    }


    checkAnswer(question: QuestionsType, answer: string): AnswerType {
        if (question.correctAnswer == answer) {
            return {
                questionId: question.id,
                answerStatus: "Correct",
                addedAt: new Date()
            }
        }
        return {
            questionId: question.id,
            answerStatus: "Incorrect",
            addedAt: new Date()
        }

    }

    async finishGameHelper(userId: ObjectId): Promise<boolean> {
        const checkGameFinish = await this.gameRepositories.checkGameFinishDb(userId)

        if (checkGameFinish) {
            await this.addFinishScore(checkGameFinish)
            return true
        }

        return false

    }

    async addFinishScore(resultGame: TotalGameScoreWithUser) {
        let winnerAndLoser: winnerAndLoserType;
        const firstPlayer = resultGame.firstPlayer
        const secondPlayer = resultGame.secondPlayer
        if (firstPlayer.score > secondPlayer.score) {
            winnerAndLoser = {
                winner: {
                    user: firstPlayer.user,
                    score: firstPlayer.score

                },
                loser: {
                    user: secondPlayer.user,
                    score: secondPlayer.score

                }
            }
            await this.scoreGameRepositories.addWinnerAndLoser(winnerAndLoser)
        }
        winnerAndLoser = {
            winner: {
                user: secondPlayer.user,
                score: secondPlayer.score

            },
            loser: {
                user: firstPlayer.user,
                score: firstPlayer.score


            }
        }
        await this.scoreGameRepositories.addWinnerAndLoser(winnerAndLoser)

        return true
    }
}