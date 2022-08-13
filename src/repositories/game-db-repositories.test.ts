import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {GameRepositories} from "./game-db-repositories";
import {ObjectId} from "mongodb";
import {QuestionsType} from "../types/pairQuizGame-type";


jest.setTimeout(60_0000)

describe("test for game repositories", () => {
    let mongoServer: MongoMemoryServer
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        let mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })
    const gameRepositories = new GameRepositories()
    const user1 = {
        user: {
            _id: new ObjectId("62ed677fbbf342ea570a0ea1"),
            login: "Vasya"
        },
        score: 0
    }
    const user2 = {
        user: {
            _id: new ObjectId("62ed677fbbd342ea570a0ea1"),
            login: "Masha"
        },
        score: 0
    }
    const user3 = {
        user: {
            _id: new ObjectId("62ed677fbbd342ea570a0ea1"),
            login: "Masha"
        },
        score: 0
    }

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

    describe("test for  randomQuestions", () => {
        it("should create randomQuestions", async () => {
            const result = gameRepositories.randomQuestions(questions, 5)
            expect(result.length).toBe(5)
        });


    })
    describe("test for  startNewGame", () => {
        it("should create startNewGame", async () => {
            const result = await gameRepositories.startNewGame(user1)
            expect(result.status).toBe("PendingSecondPlayer")
        });


    })
    describe("test for  connectToNewGame", () => {
        it("should create connectToNewGame", async () => {
            const result = await gameRepositories.connectToNewGame(user2)
            expect(result!.status).toBe("Active")
        });

        it("should create connectToNewGame", async () => {
            const result = await gameRepositories.connectToNewGame(user1)
            expect(result).toBeNull()
        });


    })


})