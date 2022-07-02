import {ObjectId, WithId} from 'mongodb'

export type UserDBtype = {

    id: any,
    login: string,
    email?: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt?: Date
}