import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {LikesRepositories} from "./likes-repositories";
import {LikeDbType} from "../types/like-type";
import {ObjectId} from "mongodb";

jest.setTimeout(60_0000)
describe("test for likes repositories", () => {
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
    const likesRepositories = new LikesRepositories()
    const newLike: LikeDbType = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        post: new ObjectId("62ed67b5bbf342ea571a0ea3"),
        status: "Like",
        addedAt: new Date('1995-12-17T03:24:00'),
        userId: new ObjectId("62ed67b5bbf342ea571a0ea1"),
        login: "Login"
    }
    const enazerLike: LikeDbType = {
        _id: new ObjectId("42ed67b5bbf342ea571a0ea9"),
        post: new ObjectId("62ed67b5bbf342ea571a0ea3"),
        status: "Like",
        addedAt: new Date('1995-12-17T03:24:00'),
        userId: new ObjectId("62ed67b5bbf342ea571a0ea1"),
        login: "Login"
    }
    const newDislike: LikeDbType = {
        _id: new ObjectId("62ed63b5bbf342ea571a0ea9"),
        post: new ObjectId("62ed67b5bbf342ea571a0ea3"),
        status: "Dislike",
        addedAt: new Date('1995-12-17T03:24:00'),
        userId: new ObjectId("62ed87b5bbf342ea571a0ea1"),
        login: "Login"
    }
    describe("test for  createLike", () => {
        it("should ", async () => {
            const result = await likesRepositories.createLike(newLike)
            expect(result._id).toStrictEqual(newLike._id)
            expect(result.post).toStrictEqual(newLike.post)
            expect(result.status).toBe(newLike.status)
            expect(result.addedAt).toStrictEqual(newLike.addedAt)
            expect(result.userId).toStrictEqual(newLike.userId)
            expect(result.login).toBe(newLike.login)
        });
        it("should ", async () => {
            const result = await likesRepositories.createLike(newDislike)
            expect(result._id).toStrictEqual(newDislike._id)
            expect(result.post).toStrictEqual(newDislike.post)
            expect(result.status).toBe(newDislike.status)
            expect(result.addedAt).toStrictEqual(newDislike.addedAt)
            expect(result.userId).toStrictEqual(newDislike.userId)
            expect(result.login).toBe(newDislike.login)
        });
        it("should ", async () => {
            const result = await likesRepositories.createLike(enazerLike)
            expect(result._id).toStrictEqual(enazerLike._id)
            expect(result.post).toStrictEqual(enazerLike.post)
            expect(result.status).toBe(enazerLike.status)
            expect(result.addedAt).toStrictEqual(enazerLike.addedAt)
            expect(result.userId).toStrictEqual(enazerLike.userId)
            expect(result.login).toBe(enazerLike.login)
        });

    })
    describe("test for  countLike", () => {
        it("should ", async () => {
            const result = await likesRepositories.countLike(newLike.post)
            expect(result).toBe(2)

        });
        it("should ", async () => {
            const result = await likesRepositories.countLike(newLike._id)
            expect(result).toBe(0)

        });
    })
    describe("test for  countDislake", () => {

        it("should ", async () => {

            const result = await likesRepositories.countDislake(newDislike.post)
            expect(result).toBe(1)

        });
        it("should ", async () => {
            const result = await likesRepositories.countDislake(newDislike._id)
            expect(result).toBe(0)

        });
    })
    describe("test for  myStatus", () => {
        it("should ", async () => {

            const result = await likesRepositories.myStatus(newLike.userId, newLike.post)
            expect(result).toBe("Like")

        });
        it("should ", async () => {
            const result = await likesRepositories.myStatus(newDislike.userId, newDislike.post)
            expect(result).toBe("Dislike")

        });
        it("should ", async () => {
            const result = await likesRepositories.myStatus(newDislike._id, newDislike.post)
            expect(result).toBe("None")

        });
    })
   describe("test for  newstLike", () => {
       it("should ", async () => {
           const result = await likesRepositories.newstLike(enazerLike.post)
           expect(result).toStrictEqual([{"addedAt":newLike.addedAt, "login": "Login", "userId": newLike.userId}, {"addedAt":enazerLike.addedAt, "login": "Login", "userId":enazerLike.userId}]
       )

       });

   })
      describe("test for  findLike", () => {
          it("should ", async () => {

              const result = await likesRepositories.findLike(newLike.userId, newLike.post,newLike.status)
              expect(result).toBeFalsy()

          });
          it("should ", async () => {
              const result = await likesRepositories.findLike(newDislike.userId, newDislike.post,newDislike.status)
              expect(result).toBeFalsy()

          });
          it("should ", async () => {
              const result = await likesRepositories.findLike(newDislike.userId, enazerLike.post,newDislike.status)
              expect(result).toBeFalsy()

          });
      })


})