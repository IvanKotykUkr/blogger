import {ObjectId, WithId} from 'mongodb'
export type UserDBtype = WithId <{
    _id:ObjectId,
    id:any,
    userName:string,
    email?:string,
    passwordHash:string,
    passwordSalt:string,
    createdAt?: Date
}>