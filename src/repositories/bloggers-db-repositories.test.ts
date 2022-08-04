import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose, {Schema} from "mongoose";
import {BloggersRepositories} from "./bloggers-db-repositories";
import {ObjectId} from "mongodb";
import {BloggerDBType} from "../types/blogger-type";


jest.setTimeout(60_0000)

describe("test for blogger repository", () => {
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
    const bloggersRepositories = new BloggersRepositories()
    const newBlogger:BloggerDBType = {
        _id: new ObjectId(),
        name: "Vasya",
        youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"
    }
    describe("test for  reqBlogger", () => {


    })
    describe("test for paginationFilter", () => {

    })
    describe("test for blogger bloggersSearchCount", () => {

    })
    describe("test for blogger getBloggersSearchTerm", () => {

    })
    describe("test for blogger findBloggersById", () => {

    })
    describe("test for blogger createBlogger", () => {

        it("should create Blogger", async () => {

            const result = await bloggersRepositories.createBlogger(newBlogger)

            expect(result.id).toBe(newBlogger._id)
            expect(result.name).toBe(newBlogger.name)
            expect(result.youtubeUrl).toBe(newBlogger.youtubeUrl)


        });






    })
    describe("test for blogger updateBloggers", () => {

        it("should create Blogger", async () => {

            const result = await bloggersRepositories.updateBloggers(newBlogger)

            expect(result).toBe(false)



        });

    })
    describe("test for blogger deleteBloggers", () => {

    })
})