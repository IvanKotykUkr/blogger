import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {UserRepositories} from "./user-db-repositories";
import {UserDBType} from "../types/user-type";
import {ObjectId} from "mongodb";

jest.setTimeout(60_0000)
describe("test for user repo", () => {
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
    const userMasha: UserDBType = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        accountData: {
            login: "Masha",
            email: "masha@gmail.com",
            passwordHash: "1234",
            passwordSalt: "5678",
            createdAt: new Date('1995-12-17T03:24:00')
        },
        emailConfirmation: {
            confirmationCode: "qwerty1",
            expirationDate: new Date('1995-12-17T03:24:00'),
            isConfirmed: false,
        }

    }
    const userVasya: UserDBType = {
        _id: new ObjectId("62ed67b5bbf342ea571a0ea5"),
        accountData: {
            login: "Vasya",
            email: "vasya@gmail.com",
            passwordHash: "1234",
            passwordSalt: "5678",
            createdAt: new Date('1995-12-17T03:24:00')
        },
        emailConfirmation: {
            confirmationCode: "trewq2",
            expirationDate: new Date('1995-12-17T03:24:00'),
            isConfirmed: false,
        }

    }
    const newMasha = [{
        id: new ObjectId("62ed67b5bbf342ea571a0ea9"),
        login: "Masha"
    }]
    const newVasya = [{
        id: new ObjectId("62ed67b5bbf342ea571a0ea5"),
        login: "Vasya"
    }]

    describe("test for  createUser", () => {
        it("should create  user1", async () => {
            const result = await userRepositories.createUser(userMasha)

            expect(result._id).toBe(userMasha._id)
            expect(result.accountData).toEqual(userMasha.accountData)
            expect(result.emailConfirmation).toEqual(userMasha.emailConfirmation)

        });
        it("should create  user2", async () => {
            const result = await userRepositories.createUser(userVasya)

            expect(result._id).toBe(userVasya._id)
            expect(result.accountData).toEqual(userVasya.accountData)
            expect(result.emailConfirmation).toEqual(userVasya.emailConfirmation)

        });

    })

    describe("test for  reqUsers", () => {
        it("return", async () => {
            const result = userRepositories.reqUsers(userMasha)

            expect(result._id).toBe(userMasha._id)
            expect(result.accountData).toEqual(userMasha.accountData)
            expect(result.emailConfirmation).toEqual(userMasha.emailConfirmation)

        });
        it("return", async () => {
            const result = userRepositories.reqUsers(userVasya)

            expect(result._id).toBe(userVasya._id)
            expect(result.accountData).toEqual(userVasya.accountData)
            expect(result.emailConfirmation).toEqual(userVasya.emailConfirmation)

        });


    })

    describe("test for  countUsers", () => {
        it("should return", async () => {
            const result = await userRepositories.countUsers()
            expect(result).toBe(2)
        });

    })
    describe("test for  getAllUsersPagination", () => {
        it("should return  ", async () => {
            const result = await userRepositories.getAllUsersPagination(1, 1)

            expect(result).toStrictEqual(newMasha)


        });

        it("should return  ", async () => {
            const result = await userRepositories.getAllUsersPagination(2, 1)

            expect(result).toStrictEqual(newVasya)

        });

    })
    describe("test for  findUserById", () => {
        it("should return user", async () => {
            const result = await userRepositories.findUserById(userMasha._id)
            expect(result!.id).toEqual(userMasha._id)
            expect(result!.login).toEqual(userMasha.accountData.login)
            expect(result!.email).toEqual(userMasha.accountData.email)
            expect(result!.passwordHash).toEqual(userMasha.accountData.passwordHash)
            expect(result!.passwordSalt).toEqual(userMasha.accountData.passwordSalt)
            expect(result!.createdAt).toEqual(userMasha.accountData.createdAt)

        });
        it("should return null", async () => {
            const result = await userRepositories.findUserById(new ObjectId("32ed67b5bbf342ea571a0ea9"))
            expect(result).toBeNull()
        });

    })
    describe("test for  findLoginOrEmail", () => {
        it("should return Masha", async () => {
            const result = await userRepositories.findLoginOrEmail(userMasha.accountData.login)
            expect(result!._id).toStrictEqual(userMasha._id)
            expect(result!.accountData).toEqual(userMasha.accountData)
            expect(result!.emailConfirmation).toEqual(userMasha.emailConfirmation)

        });
        it("should return Vasya", async () => {
            const result = await userRepositories.findLoginOrEmail(userVasya.accountData.email)

            expect(result!._id).toStrictEqual(userVasya._id)
            expect(result!.accountData).toEqual(userVasya.accountData)
            expect(result!.emailConfirmation).toEqual(userVasya.emailConfirmation)
        });
        it("should return Null", async () => {
            const result = await userRepositories.findLoginOrEmail("Nadya")

            expect(result).toBeNull()
        });

    })
    describe("test for findUserByCode", () => {
        it("should return userMasha", async () => {
            const result = await userRepositories.findUserByCode("qwerty1")
            expect(result!._id).toStrictEqual(userMasha._id)
            expect(result!.accountData).toEqual(userMasha.accountData)
            expect(result!.emailConfirmation).toEqual(userMasha.emailConfirmation)

        });
        it("should return null", async () => {
            const result = await userRepositories.findUserByCode("1")
            expect(result).toBeNull()
        });

    })
    describe("test for  deleteUserById", () => {
        it("should return false", async () => {
            const result = await userRepositories.deleteUserById(new ObjectId("64ed67b5bbf342ea571a0ea5"))
            expect(result).toBeFalsy()
        });
        it("should return false", async () => {
            const result = await userRepositories.deleteUserById(userMasha._id)
            expect(result).toBeTruthy()
        });
        it("should return false", async () => {
            const result = await userRepositories.deleteUserById(userMasha._id)
            expect(result).toBeFalsy()
        });

    })

    describe("test for  updateConfirmation", () => {
        it("should return false", async () => {
            const result = await userRepositories.updateConfirmation(new ObjectId("62ed67b5bbf342ea571a0ea9"))
            expect(result).toBeFalsy()
        });
        it("should return true", async () => {
            const result = await userRepositories.updateConfirmation(new ObjectId("62ed67b5bbf342ea571a0ea5"))
            expect(result).toBeTruthy()
        });
        it("should return false", async () => {
            const result = await userRepositories.updateConfirmation(new ObjectId("62ed67b5bbf342ea571a0ea5"))
            expect(result).toBeFalsy()
        });

    })
    describe("test for  renewConfirmationCode", () => {
        it("should return code", async () => {
            const result = await userRepositories.renewConfirmationCode(userVasya.accountData.email, "tyrf", new Date('2001-12-17T03:24:00'))
            expect(result).toBe("tyrf")
        });
        it("should return null", async () => {
            const result = await userRepositories.renewConfirmationCode(userMasha.accountData.email, "tyrf", new Date('2001-12-17T03:24:00'))
            expect(result).toBe("tyrf")
        });

    })


})