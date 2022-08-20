import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {GameRepositories} from "../repositories/game-db-repositories";
import {PairQuizGameHelper} from "./helpers/pairquizgame-helper";
import {PairQuizGameService} from "./pairquizgame-service";
import {container} from "../composition-root";
import {ScoreGameRepositories} from "../repositories/score-game-repositories";

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
    const scoreGameRopisitory = container.resolve(ScoreGameRepositories)
    const pairQuizGameHelper = new PairQuizGameHelper(gameRepositories, scoreGameRopisitory)
    const pairQuizGameService = new PairQuizGameService(pairQuizGameHelper)

    describe("test for  connectGame", () => {
        it("should create Game", async () => {
            const result = await pairQuizGameService.connectGame(user1._id, user1.login)
            expect(result.status).toBe("PendingSecondPlayer")

        });

        it("should connect  to Game", async () => {
            const result = await pairQuizGameService.connectGame(user2._id, user2.login)
            expect(result.status).toBe("Active")

        });


    })
})