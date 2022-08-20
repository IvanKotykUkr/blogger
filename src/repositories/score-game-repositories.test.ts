import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {ScoreGameRepositories} from "./score-game-repositories";
import {ObjectId} from "mongodb";
import {container} from "../composition-root";


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
    const scoreGameRepositories = container.resolve(ScoreGameRepositories)
    const firstPair = {
        winner: {
            user: {
                id: new ObjectId("62fe856c98873f14eb0583fa"),
                login: "Nadya"
            },
            score: 5
        },
        loser: {
            user: {
                id: new ObjectId("62fe856c98873f14eb0584fa"),
                login: "Vasya"
            },
            score: 3
        }
    }
    const secondPair = {
        winner: {
            user: {
                id: new ObjectId("62fe856c98873f14eb0584fa"),
                login: "Vasya"
            },
            score: 4
        },
        loser: {
            user: {
                id: new ObjectId("62fe856c98873f14eb0583fa"),
                login: "Nadya"
            },
            score: 2
        }
    }
    describe("test for  addWinnerAndLoser", () => {
        it("should return", async () => {
            const result = await scoreGameRepositories.addWinnerAndLoser(firstPair)
            expect(result).toBeNull()

        });
        it("should return", async () => {
            const result = await scoreGameRepositories.addWinnerAndLoser(secondPair)
            expect(result).toBe(22)


        })
        it("should return", async () => {
            const result = await scoreGameRepositories.addWinnerAndLoser(firstPair)
            expect(result).toBe(22)


        })
        it("should return", async () => {
            const result = await scoreGameRepositories.addWinnerAndLoser(secondPair)
            expect(result).toBe(22)


        })
        describe("test for  getAllPlayers", () => {
            it("should return", async () => {
                const result = await scoreGameRepositories.getAllPlayers(1, 8)
                expect(result.length).toBe(2)
            });


        })

    })
})