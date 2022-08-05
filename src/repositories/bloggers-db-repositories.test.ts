import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {BloggersRepositories} from "./bloggers-db-repositories";
import {ObjectId} from "mongodb";
import {BloggerDBType} from "../types/blogger-type";
import {BloggersModelClass} from "./db";


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
    const newBlogger: BloggerDBType = {
        _id: new ObjectId(),
        name: "Vasya",
        youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"
    }
    describe("test for  reqBlogger", () => {
        it("should create reqBlogger", async () => {

            const result = bloggersRepositories.reqBlogger(newBlogger)

            expect(result.id).toBe(newBlogger._id)
            expect(result.name).toBe(newBlogger.name)
            expect(result.youtubeUrl).toBe(newBlogger.youtubeUrl)
        });


    })
    describe("test for paginationFilter", () => {
        it("should create paginationFilter", async () => {

            const result = await bloggersRepositories.paginationFilter("vasya")
            expect(result).toStrictEqual({"name": {"$regex": "vasya"}})
        });
        it("should return {}", async () => {

            const result = await bloggersRepositories.paginationFilter(null)
            expect(result).toStrictEqual({})
        });


    })
    describe("test for blogger bloggersSearchCount", () => {
        it("should return 0", async () => {

            const result = await bloggersRepositories.bloggersSearchCount("vasya")
            expect(result).toBe(0)
        });
        it("should return 0", async () => {

            const result = await bloggersRepositories.bloggersSearchCount(null)
            expect(result).toBe(0)
        });
        it("should return o", async () => {
            await BloggersModelClass.insertMany({
                name: "Olya",
                youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

            })
            const result = await bloggersRepositories.bloggersSearchCount("Vasya")
            expect(result).toStrictEqual(0)
        });
        it("should return 1 ", async () => {

            const result = await bloggersRepositories.bloggersSearchCount("Olya")
            expect(result).toBe(1)
        });
    })
    describe("test for blogger getBloggersSearchTerm", () => {
        it("should return array Bloggers ", async () => {
            await BloggersModelClass.insertMany({
                name: "Olya",
                youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

            })
            const result = await bloggersRepositories.getBloggersSearchTerm(3, 3, "Olya")
            expect(result).toStrictEqual([])
        });
        it("should return {} ", async () => {

            const result = await bloggersRepositories.getBloggersSearchTerm(5, 5, "N")
            expect(result).toStrictEqual([])
        });


    })
    describe("test for blogger findBloggersById", () => {
        const oldBloger = {
            _id: new ObjectId('62d1d784431342239445bc1a'),
            name: "Olya",
            youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

        }
        it("should return Blogger ", async () => {
            await BloggersModelClass.insertMany(oldBloger)
            const result = await bloggersRepositories.findBloggersById(new ObjectId(oldBloger._id))
            expect(result!.id).toStrictEqual(oldBloger._id)
            expect(result!.name).toStrictEqual(oldBloger.name)
            expect(result!.youtubeUrl).toStrictEqual(oldBloger.youtubeUrl)
        });
        it("should return null ", async () => {

            const result = await bloggersRepositories.findBloggersById(new ObjectId())
            expect(result).toBeNull()
        });
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
        const oldBloger = {
            _id: new ObjectId('62d1d784431342239445bc1a'),
            name: "Olya",
            youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

        }
        const newBlogger = {
            _id: new ObjectId('62d1d784431342239445bc1a'),
            name: "Vasya",
            youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

        }
        const differentBlogger = {
            _id: new ObjectId('62d1d784431342239445bc3a'),
            name: "Petya",
            youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

        }
        it("should return true ", async () => {

            const result = await bloggersRepositories.updateBloggers(newBlogger)
            expect(result).toBeTruthy()

        });
        it("should return false ", async () => {

            const result = await bloggersRepositories.updateBloggers(differentBlogger)
            expect(result).toBeFalsy()
        });
    })
    describe("test for blogger deleteBloggers", () => {
        const oldBloger = {
            _id: new ObjectId('62d1d784431342239445bc1a'),
            name: "Olya",
            youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

        }

        const differentBlogger = {
            _id: new ObjectId('62d1d784431342239445bc3a'),
            name: "Petya",
            youtubeUrl: "https://www.youtube.com/watch?v=6dU184lSnsk"

        }
        it("should return false ", async () => {

            const result = await bloggersRepositories.deleteBloggers(differentBlogger._id)
            expect(result).toBeFalsy()

        });
        it("should return true ", async () => {

            const result = await bloggersRepositories.deleteBloggers(oldBloger._id)
            expect(result).toBeTruthy()
        });
        it("should return false ", async () => {


            const result = await bloggersRepositories.deleteBloggers(oldBloger._id)
            expect(result).toBeFalsy()
        });

    })
})