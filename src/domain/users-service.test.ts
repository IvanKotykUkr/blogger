import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UserRepositories} from "../repositories/user-db-repositories";
import {UserHelper} from "./helpers/user-helper";
import {UsersService} from "./users-service";
import {ObjectId} from "mongodb";
import {UsersModelClass} from "../repositories/db";

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
    let b = 40 + "40"
    const userRepositories = new UserRepositories()
    const userHelper = new UserHelper(userRepositories)
    const userService = new UsersService(userRepositories, userHelper)
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
    const newUser = {

        _id: new ObjectId("62eea15a12a141613b0b7b56"),
        accountData: {
            login: "Misha",
            email: "baasdddasfdassdsardxsldasdsz@gmail.com",
            passwordHash: "$2b$10$t5UQg6oT2bYXmYSQ6R1VIeqeCPLIe3WQ3cT27I8EdSDmJJr1Xm3Ki",
            passwordSalt: "$2b$10$t5UQg6oT2bYXmYSQ6R1VIe",
            createdAt: new Date("2022-08-06T17:14:02.916+0000")
        },
        emailConfirmation: {
            confirmationCode: "edbf127e-5427-4534-a8bd-3c1bb8d073f4",
            expirationDate: new Date("2022-08-06T18:16:02.916+0000"),
            isConfirmed: false
        }
    }


    describe("test for  createUser", () => {
        it("should create userVasya", async () => {
            const result = await userService.createUser(userVasya.login, userVasya.email, userVasya.password)
            expect(result?.login).toBe(userVasya.login)
        });

        it("should create userMasha", async () => {
            const result = await userService.createUser(userMasha.login, userMasha.email, userMasha.password)
            expect(result?.login).toBe(userMasha.login)
        });


    })
    describe("test for  findUserById", () => {
        it("should create reqBlogger", async () => {
            await UsersModelClass.insertMany(newUser)
            const result = await userService.findUserById(new ObjectId("62eea15a12a141613b0b7b56"))
            expect(result?.id).toStrictEqual(newUser._id)
            expect(result?.login).toBe(newUser.accountData.login)


        })
        it("should return null", async () => {

            const result = await userService.findUserById(new ObjectId("62eea13a12a141613b0b7b56"))
            expect(result).toBeNull()


        })
        describe("test for  getAllUsers", () => {
            it("should create pagenuber", async () => {
                const result = await userService.getAllUsers(3, 1)
                expect(result?.page).toBe(3)
            });

            it("should create page size", async () => {
                const result = await userService.getAllUsers(1, 3)
                expect(result?.pageSize).toBe(3)
            });

            it("should create pageCount", async () => {
                const result = await userService.getAllUsers(1, 1)
                expect(result?.pagesCount).toBe(3)
            });

            it("should create items", async () => {
                const result = await userService.getAllUsers(3, 1)
                expect(result?.items).toStrictEqual([{
                    "id": new ObjectId("62eea15a12a141613b0b7b56"),
                    "login": "Misha",
                },])
            });


        })
        describe("test for  deleteUser", () => {
            it("should create reqBlogger", async () => {
                const result = await userService.deleteUser(new ObjectId("63eea15a12a141613b0b7b56"))
                expect(result).toBeFalsy()
            });

            it("should create reqBlogger", async () => {
                const result = await userService.deleteUser(new ObjectId("62eea15a12a141613b0b7b56"))
                expect(result).toBeTruthy()
            });

            it("should create reqBlogger", async () => {
                const result = await userService.deleteUser(new ObjectId("62eea15a12a141613b0b7b56"))
                expect(result).toBeFalsy()
            });


        })

    })
})