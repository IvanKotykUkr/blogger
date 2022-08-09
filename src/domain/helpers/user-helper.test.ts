import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UserHelper} from "./user-helper";
import {UserRepositories} from "../../repositories/user-db-repositories";


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
    const userVasya = {
        login: "Vasya",
        email: "vasya@gmail.com",
        password: "password1"
    }
    const userMasha = {
        login: "Masha",
        email: "masha@gmail.com",
        password: "password3"
    }
    const userRepositories = new UserRepositories()
    const userHelper = new UserHelper(userRepositories)
    describe("test for  generateHash", () => {
        it("should create reqBlogger", async () => {
            const result = await userHelper.generateHash(userVasya.password, "$2b$10$t5UQg6oT2bYXmYSQ6R1VIe")
            expect(result).toBe("$2b$10$t5UQg6oT2bYXmYSQ6R1VIenrKsp7u5Ch2ILtTCtcZTY3JYlQubIR2")
        });


    })
    describe("test for  makeUser", () => {
        it("should create User", async () => {
            const result = await userHelper.makeUser(userVasya.login, userVasya.email, userVasya.password)

            expect(result?.accountData.email).toBe(userVasya.email)
            expect(result?.accountData.login).toBe(userVasya.login)

        });


    })

})