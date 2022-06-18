import {MongoClient}from'mongodb'


const mongoUrl = "mongodb+srv://admin:1234@cluster0.74ecla5.mongodb.net/?retryWrites=true&w=majority" ;

export const client = new MongoClient(mongoUrl);
const db=client.db("api")
export const bloggerCollection = db.collection("bloggers");
export const postsCollection = db.collection("posts")
export async function rundDb(){
    try{
        await client.connect();
        await client.db("blogger").command({ping:1});
        console.log("Connected successfully to mongo server")
    }catch{
        await client.close();
    }
}
