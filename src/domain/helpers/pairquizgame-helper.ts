import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {GameRepositories} from "../../repositories/game-db-repositories";
import {AnswerType, FindPlayerDbType, GamePlayerType, GameType, QuestionsType} from "../../types/pairQuizGame-type";

@injectable()
export class PairQuizGameHelper {
    constructor(@inject(GameRepositories) protected gameRepositories: GameRepositories) {
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

    async findFirsPlayerHelper(userId: ObjectId): Promise<FindPlayerDbType | null> {
        return this.gameRepositories.findFirstPlayerDB(userId)
    }

    async findSecondPlayerHelper(userId: ObjectId): Promise<FindPlayerDbType | null> {
        return this.gameRepositories.findSecondPlayerDB(userId)
    }

    async addAnswerDB(firstPlayerWithAnswers: FindPlayerDbType | null, secondPlayerWithAnswers: FindPlayerDbType | null, answer: string): Promise<AnswerType | null> {
        if (firstPlayerWithAnswers) {
            const answersDb: AnswerType = this.checkAnswer(firstPlayerWithAnswers.questions, answer)
            await this.gameRepositories.addAnswerForFirstPlayer(firstPlayerWithAnswers.gameId, answersDb)
            return answersDb
        }
        if (secondPlayerWithAnswers) {
            const answersDb: AnswerType = this.checkAnswer(secondPlayerWithAnswers.questions, answer)
            await this.gameRepositories.addAnswerForSecondPlayer(secondPlayerWithAnswers.gameId, answersDb)
            return answersDb
        }
        return null
    }

    async createAnswerHelper(userId: ObjectId, answer: string): Promise<AnswerType | null> {
        const firstPlayerWithAnswers = await this.findFirsPlayerHelper(userId)
        const secondPlayerWithAnswers = await this.findSecondPlayerHelper(userId)

        if (!firstPlayerWithAnswers && !secondPlayerWithAnswers) {
            return null
        }

        return this.addAnswerDB(firstPlayerWithAnswers, secondPlayerWithAnswers, answer)

    }

    checkAnswer(question: QuestionsType, answer: string): AnswerType {
        console.log(question)
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
}