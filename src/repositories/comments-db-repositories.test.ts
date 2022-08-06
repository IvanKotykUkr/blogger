import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {CommentsRepositories} from "./comments-db-repositories";
import {ObjectId} from "mongodb";
import {CommentsModelClass} from "./db";

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
    const commentsRepositories = new CommentsRepositories()
    const newComment = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        postId: new ObjectId("62ed67b5bbf342ea571a0ea0"),
        content: "string",
        userId: new ObjectId("62ed67b5bbf342ea571a0ea6"),
        userLogin: 'string',
        addedAt: new Date('1995-12-17T03:24:00')
    }
   const newXComment = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea5"),
        postId: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        content: "string",
        userId: new ObjectId("62ed67b5bbf342ea571a0ea4"),
        userLogin: 'string',
        addedAt: new Date('1995-12-17T03:24:00')
    }
    const oldComment = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea1"),
        postId: new ObjectId("62ed67b5bbf342ea571a0ea2"),
        content: "string",
        userId: new ObjectId("62ed67b5bbf342ea571a0ea3"),
        userLogin: 'string',
        addedAt: new Date('1995-12-17T03:24:00')
    }
      const oldXComment = {
        _id: new ObjectId("62ed67b5bbf342ea511a0ea1"),
        postId: new ObjectId("62ed67b5bbf343ea571a0ea2"),
        content: "string",
        userId: new ObjectId("62ed67b5bbf347ea571a0ea3"),
        userLogin: 'string',
        addedAt: new Date('1995-12-17T03:24:00')
    }
    describe("test for  reqComment", () => {
        it("should ", async () => {
            const result = await commentsRepositories.reqComment(newComment)
            expect(result.id).toStrictEqual(newComment._id)
            expect(result.content).toBe(newComment.content)
            expect(result.userId).toStrictEqual(newComment.userId)
            expect(result.userLogin).toBe(newComment.userLogin)
            expect(result.addedAt).toBe(newComment.addedAt)
        });


    })
    describe("test for  createComment", () => {
        it("should ", async () => {
            const result = await commentsRepositories.createComment(newComment)
            expect(result!.id).toStrictEqual(newComment._id)
            expect(result!.content).toBe(newComment.content)
            expect(result!.userId).toStrictEqual(newComment.userId)
            expect(result!.userLogin).toBe(newComment.userLogin)
            expect(result!.addedAt).toBe(newComment.addedAt)
        });


    })

    describe("test for  commentCount", () => {
        it("should ", async () => {
            await CommentsModelClass.insertMany(oldComment)
            const result = await commentsRepositories.commentCount(oldComment.postId)
            expect(result).toBe(0)

        });


    })

    describe("test for  allCommentByPostIdPagination", () => {
        it("should ", async () => {
            const result = await commentsRepositories.allCommentByPostIdPagination(newComment.postId, 3, 3)
            expect(result).toStrictEqual([])
        });
        it("should ", async () => {
            const result = await commentsRepositories.allCommentByPostIdPagination(newXComment.postId, 3, 3)
            expect(result).toStrictEqual([])
        });


    })

    describe("test for  findCommentById", () => {
        it("should ", async () => {
            const result = await commentsRepositories.findCommentById(newComment._id)
            expect(result!.id).toStrictEqual(newComment._id)
            expect(result!.content).toBe(newComment.content)
            expect(result!.userId).toStrictEqual(newComment.userId)
            expect(result!.userLogin).toBe(newComment.userLogin)
            expect(result!.addedAt).toStrictEqual(newComment.addedAt)
        });
        it("should ", async () => {
            const result = await commentsRepositories.findCommentById(newXComment._id)
            expect(result).toBeNull()

        });

    })
    describe("test for  updateCommentById", () => {
        it("should ", async () => {
            const result = await commentsRepositories.updateCommentById(newXComment._id, newXComment.content)
            expect(result).toBeFalsy()
        });
        it("should ", async () => {
            const result = await commentsRepositories.updateCommentById(oldComment._id, newXComment.content)
            expect(result).toBeTruthy()
        });


    })
    describe("test for  deleteCommentsById", () => {
        it("should ", async () => {
            const result = await commentsRepositories.deleteCommentsById(newXComment._id)
            expect(result).toBeFalsy()
        });

        it("should ", async () => {
            const result = await commentsRepositories.deleteCommentsById(oldComment._id)
            expect(result).toBeTruthy()
        });


    })
    describe("test for  deleteCommentsByPost", () => {
        it("should ", async () => {
            await CommentsModelClass.insertMany({
                _id: new ObjectId("62ed67b5bbf342ea511a0ea1"),
                postId: new ObjectId("62ed67b5bbf343ea571a0ea2"),
                content: "string",
                userId: new ObjectId("62ed67b5bbf347ea571a0ea3"),
                userLogin: 'string',
                addedAt: new Date('1995-12-17T03:24:00')
            })
            const result = await commentsRepositories.deleteCommentsByPost(newXComment.postId)
            expect(result).toBeTruthy()
        });

        it("should ", async () => {
            const result = await commentsRepositories.deleteCommentsByPost(new ObjectId("62ed67b5bbf343ea571a0ea2"))
            expect(result).toBeTruthy()
        });
    })


})