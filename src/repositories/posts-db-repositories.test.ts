import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {PostsRepositories} from "./posts-db-repositories";
import {ObjectId} from "mongodb";
import {PostsModelClass} from "./db";

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
        title: "post0",
        shortDescription: "Post from add post",
        content: "cвісавvxvx",
        bloggerId: new ObjectId("62eadc5f08eb1aeddb1bb98b"),
        bloggerName: "Olia",
        addedAt: new Date()
    }
    const oldPosts = {
        _id: new ObjectId("62ed67b5bbf322ea571a0ea9"),
        title: "post1",
        shortDescription: "Post from add post",
        content: "cвісавvxvx",
        bloggerId: new ObjectId("62eadc3f08eb1aeddb1bb98b"),
        bloggerName: "Olia",
        addedAt: new Date()
    }
    const superPosts = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        title: "post2",
        shortDescription: "Post from test add post",
        content: "cвісавvxvx",
        bloggerId: new ObjectId("63eadc3f08eb1aeddb1bb98b"),
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
        it("should create  paginationFilter undefines", async () => {
            const result = await postsRepositories.paginationFilter(undefined)

            expect(result).toStrictEqual({})
        });
        /* it("should create  paginationFilter not tru", async () => {
             const result = await postsRepositories.paginationFilter("63eadc3f08eb1aeddb1bb98b")
             expect(result).toBe({"bloggerId": "63eadc3f08eb1aeddb1bb98b"})
         });
         it("should create  paginationFilter true", async () => {
             const result = await postsRepositories.paginationFilter(new ObjectId("62eadc5f08eb1aeddb1bb98b"))
             expect(result).toBe({"bloggerId": "62eadc5f08eb1aeddb1bb98b"})
         });



         */
    })
    describe("test for  findPostsByIdBloggerCount", () => {
        it("should return 1 if undefined", async () => {
            await PostsModelClass.insertMany(newPosts)
            const result = await postsRepositories.findPostsByIdBloggerCount(undefined)
            expect(result).toBe(1)
        });
        it("should return 0 if string", async () => {
            const result = await postsRepositories.findPostsByIdBloggerCount("62ed67b5bbf342ea571a0ea9")
            expect(result).toBe(0)
        });

        it("should return 1 ", async () => {
            const result = await postsRepositories.findPostsByIdBloggerCount(
                new ObjectId("62eadc5f08eb1aeddb1bb98b"))
            expect(result).toBe(1)
        });


    })
    describe("test for  findPostsByIdBloggerPagination", () => {
        it("should return 1 vlogger ", async () => {
            const result = await postsRepositories.findPostsByIdBloggerPagination(undefined, 3, 3)
            expect(result).toStrictEqual([])
        });
        it("should sould returl all bloger ", async () => {
            const result = await postsRepositories.findPostsByIdBloggerPagination("", 3, 3)

            expect(result).toStrictEqual([])
        });
        it("should return 0 ", async () => {
            const result = await postsRepositories.findPostsByIdBloggerPagination(new ObjectId("63eadc3f08eb1aeddb1bb98b"), 3, 3)

            expect(result).toStrictEqual([])
        });

        it("should return 1", async () => {
            const result = await postsRepositories.findPostsByIdBloggerPagination(new ObjectId("62eadc5f08eb1aeddb1bb98b"), 3, 3)

            expect(result).toStrictEqual([])
        });


    })
    describe("test for  findPostsById", () => {
        it("should return null", async () => {
            const result = await postsRepositories.findPostsById(superPosts.bloggerId)
            expect(result).toBeNull()
        });
        it("should return post", async () => {
            const result = await postsRepositories.findPostsById(newPosts._id)
            expect(result!.id).toStrictEqual(newPosts._id)
            expect(result!.title).toBe(newPosts.title)
            expect(result!.shortDescription).toBe(newPosts.shortDescription)
            expect(result!.content).toBe(newPosts.content)
            expect(result!.bloggerId).toStrictEqual(newPosts.bloggerId)
            expect(result!.bloggerName).toBe(newPosts.bloggerName)
        });


    })
    describe("test for  createPost", () => {
        it("should create Posts", async () => {
            const result = await postsRepositories.createPost(oldPosts)
            expect(result.id).toBe(oldPosts._id)
            expect(result.title).toBe(oldPosts.title)
            expect(result.shortDescription).toBe(oldPosts.shortDescription)
            expect(result.content).toBe(oldPosts.content)
            expect(result.bloggerId).toBe(oldPosts.bloggerId)
            expect(result.bloggerName).toBe(oldPosts.bloggerName)

        });


    })
    describe("test for  updatePost", () => {
        it("should return false", async () => {
            const result = await postsRepositories.updatePost(new ObjectId(), superPosts.title, superPosts.shortDescription, superPosts.content, superPosts.bloggerId, superPosts.bloggerName)
            expect(result).toBeFalsy()
        });

        it("should return true", async () => {
            const result = await postsRepositories.updatePost(superPosts._id, superPosts.title, superPosts.shortDescription, superPosts.content, superPosts.bloggerId, superPosts.bloggerName)

            expect(result).toBeTruthy()
        });


    })
    describe("test for  deletePost", () => {
        it("should return False", async () => {
            const result = await postsRepositories.deletePost(new ObjectId())
            expect(result).toBeFalsy()
        });

        it("should return True", async () => {
            const result = await postsRepositories.deletePost(newPosts._id)
            expect(result).toBeTruthy()
        });

        it("should return False", async () => {
            const result = await postsRepositories.deletePost(newPosts._id)
            expect(result).toBeFalsy()
        });

    })

})