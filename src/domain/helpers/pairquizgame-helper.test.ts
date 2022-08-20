import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {GameRepositories} from "../../repositories/game-db-repositories";
import {PairQuizGameHelper} from "./pairquizgame-helper";
import {ObjectId} from "mongodb";
import {ScoreGameRepositories} from "../../repositories/score-game-repositories";


jest.setTimeout(60_0000)
describe("test for user helper", () => {
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

    const user1 = {

        _id: new ObjectId("62ed677fbbf342ea570a0ea1"),
        login: "Vasya"

    }
    const user2 = {

        _id: new ObjectId("62ed677fbbd342ea570a0ea1"),
        login: "Masha"

    }
    const user3 = {

        _id: new ObjectId("62ed677fbbd342ea570a0ea1"),
        login: "Olya"

    }
    const gameRepositories = new GameRepositories()
    const scoreGameRepository = new ScoreGameRepositories()
    const pairQuizGameHelper = new PairQuizGameHelper(gameRepositories, scoreGameRepository)
    describe("test for  makeUser", () => {
        it("should create makeUser", async () => {
            const result = pairQuizGameHelper.makeUser(user1._id, user1.login)
            expect(result.user).toStrictEqual(user1)
            expect(result.score).toBe(0)
        });


    })
    describe("test for  createGame", () => {
        it("should create createGame", async () => {
            const result = await pairQuizGameHelper.createGame(user1._id, user1.login)
            expect(result.status).toBe("PendingSecondPlayer")
            expect(result.finishGameDate).toBeNull()
            expect(result.firstPlayer.user._id).toStrictEqual(user1._id)
            expect(result.firstPlayer.user.login).toStrictEqual(user1.login)
            expect(result.firstPlayer.score).toBe(0)
            expect(result.questions.length).toBe(5)
        });


    })
    describe("test for  connectToGame", () => {
        it("should create connectToGame", async () => {
            const result = await pairQuizGameHelper.connectToGame(user2._id, user2.login)
            expect(result.firstPlayer.user._id).toStrictEqual(user1._id)
            expect(result.firstPlayer.user.login).toStrictEqual(user1.login)
            expect(result.firstPlayer.score).toBe(0)
            expect(result.secondPlayer!.user._id).toStrictEqual(user2._id)
            expect(result.secondPlayer!.user.login).toStrictEqual(user2.login)
            expect(result.secondPlayer!.score).toBe(0)
            expect(result.status).toBe("Active")
            expect(result.questions.length).toBe(5)
        });

        it("should return null", async () => {
            const result = await pairQuizGameHelper.connectToGame(user3._id, user3.login)
            expect(result.status).toBe("PendingSecondPlayer")
            expect(result.finishGameDate).toBeNull()
            expect(result.firstPlayer.user._id).toStrictEqual(user3._id)
            expect(result.firstPlayer.user.login).toStrictEqual(user3.login)
            expect(result.firstPlayer.score).toBe(0)
            expect(result.questions.length).toBe(5)
        });


    })
})
