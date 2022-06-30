import {ObjectId, WithId} from 'mongodb'

export type UserDBtype = WithId<{
    _id: ObjectId,
    id: any,
    login: string,
    email?: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt?: Date
}>