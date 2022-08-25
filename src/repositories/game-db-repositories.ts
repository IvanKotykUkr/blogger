import "reflect-metadata";
import {injectable} from "inversify";
import {
    AnswerType,
    FindPlayerDbType,
    GamePlayerType,
    GameType,
    QuestionsType,
    TotalGameScoreWithUser
} from "../types/pairQuizGame-type";
import {GameModel} from "./db";
import {ObjectId} from "mongodb";

const questions: QuestionsType[] = [
    {
        id: "62ed677fbbf342ea570a0ea1",
        body: "What year was the very first model of the iPhone released?",
        correctAnswer: "2007",
    },
    {
        id: "62ed677fbbf342ea570a0ea2",
        body: "What was the name of the actor who played Jack Dawson in Titanic?",
        correctAnswer: "Leonardo Dicaprio",
    },
    {
        id: "62ed677fbbf342ea570a0ea3",
        body: "Which company owns Bugatti, Lamborghini. Audi, Porsche, and Ducati?",
        correctAnswer: "Volkswagen",
    },
    {
        id: "62ed677fbbf342ea570a0ea4",
        body: "What does BMW stand for (in English)?",
        correctAnswer: "Bavarian Motor Works",
    },
    {
        id: "62ed677fbbf342ea570a0ea5",
        body: "Which racer holds the record for the most Grand Prix wins?",
        correctAnswer: "Michael Schumacher",
    },
    {
        id: "62ed677fbbf342ea570a0ea6",
        body: "Which country invented tea?",
        correctAnswer: "China",
    },
    {
        id: "62ed677fbbf342ea570a0ea7",
        body: "Which American state is the largest (by area)?",
        correctAnswer: "Alaska",
    },
    {
        id: "62ed677fbbf342ea570a0ea8",
        body: "What is the smallest country in the world?",
        correctAnswer: "Vatican City",
    },
]

@injectable()
export class GameRepositories {

    randomQuestions(questions: QuestionsType[], n: number): QuestionsType[] {
        const result = questions.sort(() => Math.random() - Math.random()).slice(0, n)

        return result.map((d => ({id: d.id, body: d.body, correctAnswer: d.correctAnswer})))
    }

    async startNewGame(newPlayer: GamePlayerType): Promise<GameType> {
        const game = new GameModel()
        game._id = new ObjectId()
        game.firstPlayer = newPlayer
        game.secondPlayer = null
        game.status = "PendingSecondPlayer"
        game.pairCreatedDate = new Date()
        game.startGameDate = null
        game.finishGameDate = null
        await game.save()
        game.questions = this.randomQuestions(questions, 5)

        await game.save()
        return game
    }

    async connectToNewGame(newPlayer: GamePlayerType): Promise<GameType | null> {
        const game = await GameModel.findOne({status: "PendingSecondPlayer"})
        if (game) {
            game.secondPlayer = newPlayer
            game.status = "Active"
            game.startGameDate = new Date()
            await game.save()
            return game
        }
        return null
    }

    async findCurrentGame(user: ObjectId): Promise<GameType | null> {
        const game = await GameModel.findOne(
            {
                $and: [
                    {
                        $or: [
                            {"status": "PendingSecondPlayer"},
                            {"status": "Active"}
                        ]
                    },
                    {
                        $or: [
                            {"firstPlayer.user._id": user},
                            {"secondPlayer.user._id": user}
                        ]
                    }
                ]
            })

        if (!game) {
            return null
        }
        return game
    }

    async findFirstPlayerDB(userId: ObjectId): Promise<FindPlayerDbType | null> {
        const game = await GameModel.findOne(
            {
                $and: [
                    {
                        "status": "Active"
                    },


                    {"firstPlayer.user._id": userId}


                ]
            })
        if (!game) {
            return null
        }
        const answers = game.firstPlayer!.answers.length

        if (answers >= 5) {
            return null
        }
        const questionsGame = game.questions[answers]

        if (questionsGame) {
            return {
                gameId: game._id,
                questions: questionsGame
            }
        }
        return null
    }

    async findSecondPlayerDB(userId: ObjectId): Promise<FindPlayerDbType | null> {
        const game = await GameModel.findOne(
            {
                $and: [
                    {
                        "status": "Active"
                    },
                    {"secondPlayer.user._id": userId}
                ]
            })
        if (!game) {
            return null
        }
        const answers = game.secondPlayer!.answers.length
        if (answers >= 5) {
            return null
        }
        const questionsGame = game.questions[answers]

        if (questionsGame) {
            return {
                gameId: game._id,
                questions: questionsGame
            }
        }
        return null

    }

    async addAnswerForFirstPlayer(_id: ObjectId, answer: AnswerType): Promise<boolean> {
        const newAnswer = await GameModel.findOneAndUpdate({_id}, {$push: {"firstPlayer.answers": answer}})

        if (answer.answerStatus === "Correct") {
            newAnswer!.firstPlayer!.score++
            await newAnswer!.save()
            return true
        }
        return true
    }

    async addAnswerForSecondPlayer(_id: ObjectId, answer: AnswerType): Promise<boolean> {

        const newAnswer = await GameModel.findOneAndUpdate({_id}, {$push: {"secondPlayer.answers": answer}})

        if (answer.answerStatus === "Correct") {
            newAnswer!.secondPlayer!.score++
            await newAnswer!.save()
            return true
        }
        return true
    }

    async checkGameFinishDb(user: ObjectId): Promise<TotalGameScoreWithUser | null> {

        const game = await GameModel.findOne(
            {
                $and: [
                    {"status": "Active"}
                    ,
                    {
                        $or: [
                            {"firstPlayer.user._id": user},
                            {"secondPlayer.user._id": user}
                        ]
                    }
                ]
            })

        const firstPlayer = game!.firstPlayer!.answers.length
        const secondPlayer = game!.secondPlayer!.answers.length

        if (firstPlayer < 5) {
            return null
        }
        if (secondPlayer < 5) {
            return null
        }

        const dateLastAnswerFirstPlayer = game!.firstPlayer!.answers[firstPlayer - 1]
        const dateLastAnswerSecondPlayer = game!.secondPlayer!.answers[secondPlayer - 1]

        if (dateLastAnswerFirstPlayer > dateLastAnswerSecondPlayer) {
            game!.secondPlayer!.score++
            game!.status = "Finished"
            game!.finishGameDate = new Date()

        }
        if (dateLastAnswerFirstPlayer < dateLastAnswerSecondPlayer) {
            game!.firstPlayer!.score++
            game!.status = "Finished"
            game!.finishGameDate = new Date()
        }


        await game!.save()
        const gameResult = {
            firstPlayer: {
                user: game!.firstPlayer!.user,
                score: game!.firstPlayer!.score
            },
            secondPlayer: {
                user: game!.secondPlayer!.user,
                score: game!.secondPlayer!.score
            }

        }
        return gameResult


    }

    async findGameById(gameId: ObjectId): Promise<GameType | null> {
        return GameModel.findById(gameId)

    }

    async countGame(userid: ObjectId): Promise<number> {
        return GameModel.countDocuments({
            $or: [
                {"firstPlayer.user._id": userid},
                {"secondPlayer.user._id": userid}
            ]
        })

    }

    async getAllGamesOfOnePlayer(userid: ObjectId, number: number, size: number): Promise<GameType[]> {
        return GameModel.find({
            $or: [
                {"firstPlayer.user._id": userid},
                {"secondPlayer.user._id": userid}
            ]
        })
            .skip(number > 0 ? ((number - 1) * size) : 0)
            .limit(size)
            .lean()
    }
}