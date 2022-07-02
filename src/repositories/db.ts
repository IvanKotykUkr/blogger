import {MongoClient, ObjectId, WithId, InsertOneResult} from 'mongodb'
import {settings} from "../settings";


export type BloggerType = {
    id: string,
    name: string,
    youtubeUrl: string,
}
export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
    bloggerName: string
}
export type CommentType = {
    id: string,
    postid?: string,
    content: string,
    userId: string,
    userLogin: string,
    addedAt: string
}

export type UserType = {
    id: any,
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

