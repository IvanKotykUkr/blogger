import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {AccessAttemptsRepositories} from "./access-attempts-db-repositories";
import {ObjectId} from "mongodb";

jest.setTimeout(60_0000)
describe("test for acccces attempts", () => {
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
    const accessAttemptsRepositories = new AccessAttemptsRepositories()
    const report = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        ip: "1.1.1.1.1",
        date: new Date('1995-12-17T03:24:00'),

        process: "REGISTER"
    }
    const newReport = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        ip: "1.1.1.1.1",
        date: new Date('1995-12-17T03:24:00'),

        process: "REGISTER"
    }

    describe("test for  createRecord", () => {
        it("should ", async () => {
            const result = await accessAttemptsRepositories.createRecord(report)
            expect(result).toStrictEqual([report.date])
        });


    })

    describe("test for  countDate", () => {
        it("should ", async () => {
            const result = await accessAttemptsRepositories.createRecord(newReport)
            expect(result).toStrictEqual([newReport.date, newReport.date])
        });


    })


})