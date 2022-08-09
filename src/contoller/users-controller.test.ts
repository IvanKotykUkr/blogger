import {Request, Response} from "express";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UserRepositories} from "../repositories/user-db-repositories";
import {UserHelper} from "../domain/helpers/user-helper";
import {UsersService} from "../domain/users-service";
import {ObjectId} from "mongodb";
import {UsersController} from "./users-controller";
import {UsersModelClass} from "../repositories/db";

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
    const userRepositories = new UserRepositories()
    const userHelper = new UserHelper(userRepositories)
    const userService = new UsersService(userRepositories, userHelper)
    const usersController = new UsersController(userService)
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

    describe("test for   getUsers", () => {
        it("should return 200", async () => {
            const reqForTest: Partial<Request> = {query: {PageNumber: "1", PageSize: "1"}}
            let status: number = 0
            const resForTest: Partial<Response> = {
                status: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await usersController.getUsers(reqForTest as Request, resForTest as Response)

            expect(status).toEqual(200)
        });

        it("should return 200 without req", async () => {
            const reqForTest: Partial<Request> = {}
            let status: number = 0
            const resForTest: Partial<Response> = {
                status: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await usersController.getUsers(reqForTest as Request, resForTest as Response)

            expect(status).toEqual(200)
        });


    })
    describe("test for   createUser", () => {
        it("should return 201", async () => {
            const reqForTest: Partial<Request> = {
                body: {
                    login: userVasya.login,
                    email: userVasya.email,
                    password: userVasya.password
                }
            }
            let status: number = 0
            const resForTest: Partial<Response> = {
                status: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await usersController.createUser(reqForTest as Request, resForTest as Response,)

            expect(status).toEqual(201)

        });

    })
    describe("test for  deleteUser", () => {
        it("should return 404 ", async () => {
            await UsersModelClass.insertMany(newUser)
            const reqForTest: Partial<Request> = {params: {id: "62eea15a12a141613b0b7b55"}}
            let status: number = 0
            const resForTest: Partial<Response> = {
                sendStatus: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await usersController.deleteUser(reqForTest as Request, resForTest as Response)

            expect(status).toEqual(404)
        });
        it("should return 204", async () => {
            const reqForTest: Partial<Request> = {params: {id: "62eea15a12a141613b0b7b56"}}
            let status: number = 0
            const resForTest: Partial<Response> = {
                sendStatus: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await usersController.deleteUser(reqForTest as Request, resForTest as Response)

            expect(status).toEqual(204)

        });

        it("should return 404 ", async () => {
            const reqForTest: Partial<Request> = {params: {id: "62eea15a12a141613b0b7b56"}}
            let status: number = 0
            const resForTest: Partial<Response> = {
                sendStatus: (s: number) => {
                    status = s
                    const resT: Partial<Response> = {
                        json: () => ({} as Response)
                    }
                    return resT as Response
                }
            }

            await usersController.deleteUser(reqForTest as Request, resForTest as Response)

            expect(status).toEqual(404)

        });


    })

})
