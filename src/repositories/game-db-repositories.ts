import "reflect-metadata";
import {injectable} from "inversify";
import {GameType, PlayerType, QuestionsType} from "../types/pairQuizGame-type";
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
        correctAnswer: "Leonardo DiCaprio",
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

        return result.map((d => ({id: d.id, body: d.body})))
    }

    async startNewGame(newPlayer: PlayerType): Promise<GameType> {
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

    async connectToNewGame(newPlayer: PlayerType): Promise<GameType | null> {
        const game = await GameModel.findOneAndUpdate({status: "PendingSecondPlayer"})
        if (game) {

            game.secondPlayer = newPlayer
            game.status = "Active"

            await game.save()
            return game
        }
        return null
    }
}