import {MongoClient, ObjectId, WithId, InsertOneResult} from 'mongodb'
import {settings} from "../settings";


export type BloggerType = {
    id?: ObjectId | string,
    _id?: ObjectId | string,
    name: string,
    youtubeUrl: string,
}
export type PostType = {
    id?: ObjectId,
    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: ObjectId | string,
    bloggerName: string
}
export type CommentType = {
    id?: ObjectId | string,
    _id?: ObjectId | string,
    postid?: ObjectId | string,
    content: string,
    userId: ObjectId | string | undefined,
    userLogin: string,
    addedAt: string
}

export type UserType = {
    id?: ObjectId | string,
    _id?: ObjectId | string
    login: string,
    email?: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt?: Date
}
export type UserFromTokenType = {
    userId: string,
    iat: number,
    exp: number
}
export type PostTypeInsert = InsertOneResult<{
    id?: ObjectId,
    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string
}>

export const client = new MongoClient(settings.MONGO_URL);
const db = client.db("api")
export const bloggerCollection = db.collection("bloggers");
export const postsCollection = db.collection("posts");
export const usersCollection = db.collection("users");
export const commentsCollection = db.collection("comment");

export async function runDb() {
    try {
        await client.connect();
        await client.db("blogger").command({ping: 1});
        console.log("Connected successfully to mongo server")
    } catch {
        await client.close();
    }
}

