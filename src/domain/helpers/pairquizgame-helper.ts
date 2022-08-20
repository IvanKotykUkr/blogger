import {inject, injectable} from "inversify";
import {ObjectId} from "mongodb";
import {GameRepositories} from "../../repositories/game-db-repositories";
import {
    AnswerType,
    FindPlayerDbType,
    GamePlayerType,
    GameResponseType,
    GameType,
    GameWithPagination,
    QuestionsType
} from "../../types/pairQuizGame-type";

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


    async currentGame(player: ObjectId): Promise<GameResponseType | boolean> {
        const game = await this.gameRepositories.findCurrentGame(player)
        if (!game) {
            return false
        }
        const goodGame = this.makeGame(game)
        return goodGame

    }

    makeGame(game: GameType): Promise<GameResponseType> {


        return {
            // @ts-ignore
            id: game._id,
            firstPlayer: {
                answers: game.firstPlayer.answers,
                user: {
                    id: game.firstPlayer.user._id,
                    login: game.firstPlayer.user.login
                },
                score: game.firstPlayer.score
            },
            secondPlayer: {// @ts-ignore
                answers: game.secondPlayer.answers,
                user: {// @ts-ignore
                    id: game.secondPlayer.user._id,
                    // @ts-ignore
                    login: game.secondPlayer.user.login
                },// @ts-ignore
                score: game.secondPlayer.score
            },
            questions: game.questions.map(d => ({id: d.id, body: d.body})),
            status: game.status,
            pairCreatedDate: game.pairCreatedDate,
            startGameDate: game.startGameDate,
            finishGameDate: game.finishGameDate


        }

    }

    async findGame(gameId: ObjectId): Promise<GameResponseType | null> {

        const game = await this.gameRepositories.findGameById(gameId)

        if (!game) {
            return null
        }
        const goodGame = this.makeGame(game)
        return goodGame

    }

    async getAllGamesByUserId(userid: ObjectId, pagenumber: number, pagesize: number): Promise<GameWithPagination> {
        let totalCount: number = await this.gameRepositories.countGame(userid)
        let page: number = pagenumber
        let pageSize: number = pagesize
        let pagesCount: number = Math.ceil(totalCount / pageSize)
        let items = await this.gameRepositories.getAllGamesOfOnePlayer(userid, page, pageSize)
        let mapItems = items.map(p => ({
            id: p._id,
            firstPlayer: {
                answers: p.firstPlayer.answers,
                user: {
                    id: p.firstPlayer.user._id,
                    login: p.firstPlayer.user.login
                },
                score: p.firstPlayer.score
            },
            secondPlayer: {// @ts-ignore
                answers: p.secondPlayer.answers,
                user: {// @ts-ignore
                    id: p.secondPlayer.user._id,
                    // @ts-ignore
                    login: p.secondPlayer.user.login
                },// @ts-ignore
                score: p.secondPlayer.score
            },
            questions: p.questions.map(d => ({id: d.id, body: d.body})),
            status: p.status,
            pairCreatedDate: p.pairCreatedDate,
            startGameDate: p.startGameDate,
            finishGameDate: p.finishGameDate

        }))


        return {
            pagesCount,
            page,
            pageSize,
            totalCount,
            // @ts-ignore
            items: mapItems
        }

    }
}