import express, {Request,Response} from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import * as url from "url";
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";


const app = express();
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5001


app.use('/bloggers', bloggersRouter )
app.use('/posts', postsRouter)


app.listen ( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
