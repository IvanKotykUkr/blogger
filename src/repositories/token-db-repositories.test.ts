import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {TokenRepositories} from "./token-db-repositories";

jest.setTimeout(60_0000)
describe("test for posts repository", () => {
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
    const tokenRepositories = new TokenRepositories()
    const firstToken = "first"
    const secondToken = "second"
    const thirdToken = "third"
    describe("test for  addTokenInBlacklist", () => {
        it("should return", async () => {
            const result = await tokenRepositories.addTokenInBlacklist(firstToken)

            expect(result).toBe(firstToken)
        });
        it("should return", async () => {
            const result = await tokenRepositories.addTokenInBlacklist(secondToken)

            expect(result).toBe(secondToken)
        });


    })
    describe("test for  checkTokenInBlacklist", () => {
        it("should create  paginationFilter undefines", async () => {
            const result = await tokenRepositories.checkTokenInBlacklist(firstToken)

            expect(result).toBeTruthy()
        });
        it("should create  paginationFilter undefines", async () => {
            const result = await tokenRepositories.checkTokenInBlacklist(thirdToken)

            expect(result).toBeFalsy()
        });

    })


})