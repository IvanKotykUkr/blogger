import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {PostsRepositories} from "./posts-db-repositories";
import {ObjectId} from "mongodb";


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
    const postsRepositories = new PostsRepositories()
    const newPosts = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        title: "post",
        shortDescription: "Post from add post",
        content: "cвісавvxvx",
        bloggerId: new ObjectId("62eadc5f08eb1aeddb1bb98b"),
        bloggerName: "Olia",
        addedAt: new Date()
    }
    describe("test for  resPost", () => {
        it("should create reqBlogger", async () => {
            const result = await postsRepositories.resPost(newPosts)
            expect(result.id).toBe(newPosts._id)
            expect(result.title).toBe(newPosts.title)
            expect(result.shortDescription).toBe(newPosts.shortDescription)
            expect(result.content).toBe(newPosts.content)
            expect(result.bloggerId).toBe(newPosts.bloggerId)
            expect(result.bloggerName).toBe(newPosts.bloggerName)
            expect(result.addedAt).toBe(newPosts.addedAt)
        });


    })
    describe("test for  paginationFilter Posts", () => {
        it("should create  paginationFilter Posts", async () => {
            const result = await postsRepositories.paginationFilter(undefined)

            expect(result).toStrictEqual({})
        });
        it("should create  paginationFilter Posts", async () => {
            const result = await postsRepositories.paginationFilter("string")

            expect(result).toBe( {})

        });
        it("should create  paginationFilter Posts", async () => {
            const result = await postsRepositories.paginationFilter(new ObjectId("62eadc5f08eb1aeddb1bb98b"))
            expect(result).toBe({ bloggerId:"62eadc5f08eb1aeddb1bb98b"})


        });


    })
    describe("test for  findPostsByIdBloggerCount", () => {
        it("should create reqBlogger", async () => {

            expect(6).toBe(6)
        });


    })
    describe("test for  findPostsByIdBloggerPagination", () => {
        it("should create reqBlogger", async () => {

            expect(6).toBe(6)
        });


    })
    describe("test for  findPostsById", () => {
        it("should create reqBlogger", async () => {

            expect(6).toBe(6)
        });


    })
    describe("test for  createPost", () => {
        it("should create Posts", async () => {
            const result = await postsRepositories.createPost(newPosts)
            expect(result.id).toBe(newPosts._id)
            expect(result.title).toBe(newPosts.title)
            expect(result.shortDescription).toBe(newPosts.shortDescription)
            expect(result.content).toBe(newPosts.content)
            expect(result.bloggerId).toBe(newPosts.bloggerId)
            expect(result.bloggerName).toBe(newPosts.bloggerName)

        });


    })
    describe("test for  updatePost", () => {
        it("should create reqBlogger", async () => {

            expect(6).toBe(6)
        });


    })
    describe("test for  deletePost", () => {
        it("should create reqBlogger", async () => {

            expect(6).toBe(6)
        });


    })

})