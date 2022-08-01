import {ObjectId} from 'mongodb'
import {settings} from "../settings";
import mongoose from 'mongoose';
import {BloggerDBType} from "../types/blogger-type";
import {PostsDBType} from "../types/posts-type";
import {UserDBType} from "../types/user-type";
import {CommentsDBType} from "../types/commnet-type";
import {TokensType} from "../types/tokens-types";
import {RecordType} from "../types/traffic-type";
import {LikeDbType} from "../types/like-type";


//export const client = new MongoClient(settings.MONGO_URL);
//const db = client.db("newapi")
//export const bloggerCollection = db.collection("bloggers");
//export const postsCollection = db.collection("posts");
//export const usersCollection = db.collection("users");
//export const commentsCollection = db.collection("comment");
//export const trafficCollection = db.collection("traffic");
//export const tokenCollection = db.collection("tokens")

const BloggerSchema = new mongoose.Schema<BloggerDBType>({
        name: String,
        youtubeUrl: String,
        /* scrId:mongoose.Types.ObjectId,
         isHistory:Boolean,
         changer:String,


         */

    },
    {
        versionKey: false,
    });
const PostsSchema = new mongoose.Schema<PostsDBType>({
        title: String,
        shortDescription: String,
        content: String,
        bloggerId: ObjectId,
        bloggerName: String,
        addedAt: Date
    },
    {
        versionKey: false,
    });
const UserSchema = new mongoose.Schema<UserDBType>({
            accountData: {
                login: String,
                email: String,
                passwordHash: String,
                passwordSalt: String,
                createdAt: Date
            },
            emailConfirmation: {
                confirmationCode: String,
                expirationDate: Date,
                isConfirmed: Boolean
            }


        },
        {
            versionKey: false,
        }
    )
;
const CommentsSchema = new mongoose.Schema<CommentsDBType>({
        postid: ObjectId,
        content: String,
        userId: ObjectId,
        userLogin: String,
        addedAt: Date
    },
    {
        versionKey: false,
    });
const TrafficSchema = new mongoose.Schema<RecordType>({
        ip: String,
        date: Date,
        process: String
    },
    {
        versionKey: false,
    });
const TokenSchema = new mongoose.Schema<TokensType>({
        token: String,
        addedAt: Number
    },
    {
        versionKey: false,

    });
const LikeSchema = new mongoose.Schema<LikeDbType>({
        _id: ObjectId,
        post: ObjectId,
        status: String,
        addedAt: Date,
        userId: ObjectId,
        login: String,
    },
    {
        versionKey: false,
    });


export const BloggersModelClass = mongoose.model('Bloggers', BloggerSchema);
export const PostsModelClass = mongoose.model('Posts', PostsSchema);
export const UsersModelClass = mongoose.model('Users', UserSchema);
export const CommentsModelClass = mongoose.model('Comments', CommentsSchema);
export const TrafficModelClass = mongoose.model('Traffic', TrafficSchema);
export const TokensModelClass = mongoose.model('Tokens', TokenSchema);
export const LikesModelClass = mongoose.model('Likes', LikeSchema);
const cleanToken = async () => {
    await TokensModelClass.deleteMany({addedAt: {$lt: Date.now() - 1000 * 60 * 60 * 24}}).lean()

    console.log("cleared token")
    return true


}

export async function runDb() {
    try {

        await mongoose.connect(settings.MONGO_URL);
        // await client.connect();
        //await client.db("blogger").command({ping: 1});
        console.log("Connected successfully to mongo server")
        setInterval(cleanToken, 1000 * 60 * 60 * 24)


    } catch {
        console.log("Cant connect to db")
        //  await client.close()
        await mongoose.disconnect();
    }
}

export const testing = {


    async deleteAllData(): Promise<void> {
        try {
            await mongoose.connection.dropDatabase()


        } catch {
            //  await client.close()
            await mongoose.disconnect()
            await runDb()
        }


    }
}