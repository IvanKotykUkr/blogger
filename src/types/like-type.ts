import {ObjectId} from "mongoose";

export class LikeDbType {
    constructor(
       public _id:ObjectId,
        public post:ObjectId,
        public status:string,
        public addedAt:Date,
       public userId:ObjectId,
       public login:string,


    ) {
    }
}